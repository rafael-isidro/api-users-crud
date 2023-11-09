import validator from "validator";
import bcrypt from "bcrypt";

import { User } from "../../models/user";
import {
  HttpResponse,
  HttpRequest,
  IService,
} from "../../controllers/protocols";
import { CreateUserParams, ICreateUserRepository } from "./protocols";
import { badRequest, created, serverError } from "../../controllers/helpers";
import { MongoGetUserRepository } from "../../repositories/get-user/mongo-get-user";

export class CreateUserService implements IService {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const requiredFields = ["firstName", "lastName", "email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          return badRequest(`Field ${field} is required.`);
        }
      }

      const mongoGetUserRepository = new MongoGetUserRepository();
      const emailExists = await mongoGetUserRepository.getUserByEmail(
        httpRequest.body!.email
      );

      if (emailExists) {
        return badRequest("E-mail already exists.");
      }

      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      if (!emailIsValid) {
        return badRequest("E-mail is invalid.");
      }

      const passwordIsValid = validator.isStrongPassword(
        httpRequest.body!.password
      );
      if (!passwordIsValid) {
        return badRequest(
          "Your password must be have at least 8 characters long, combination of uppercase and lowercase letters, 1 special character and 1 numeric digit."
        );
      }
      const hashPassword = await bcrypt.hash(httpRequest.body!.password, 10);
      httpRequest.body!.password = hashPassword;

      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userRegistered } = user;
      return created<User>(userRegistered);
    } catch (error) {
      return serverError();
    }
  }
}
