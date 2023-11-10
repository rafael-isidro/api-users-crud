import validator from "validator";
import bcrypt from "bcrypt";

import { User } from "../../models/user";
import { HttpResponse, HttpRequest } from "../../controllers/protocols";
import { CreateUserParams, ICreateUserRepository } from "./protocols";
import { badRequest, created, serverError } from "../../controllers/helpers";
import { MongoGetUserRepository } from "../../repositories/get-user/mongo-get-user";
import { IService } from "../protocols";

export class CreateUserService implements IService {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const mongoGetUserRepository = new MongoGetUserRepository();
      const body = httpRequest.body!;
      const emailExists = await mongoGetUserRepository.getUserByParam({
        email: body.email.toLowerCase(),
      });
      if (emailExists) return badRequest("E-mail already exists.");

      const isValidEmailAndPassword = await this.verifyEmailAndPassword(
        body.email,
        body.password
      );
      if (!isValidEmailAndPassword)
        return badRequest(
          `E-mail or password is invalid: \n- E-mail format is name@example.com \n- Password must be have at least 8 characters long, combination of uppercase and lowercase letters, 1 special character and 1 numeric digit.`
        );
      body.password = await bcrypt.hash(body.password, 10);
      body.email = body.email.toLowerCase();

      const user = await this.createUserRepository.createUser(body);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userRegistered } = user;

      return created<User>(userRegistered);
    } catch (error) {
      return serverError();
    }
  }
  async verifyEmailAndPassword(email: string, password: string) {
    const emailIsValid = validator.isEmail(email.toLowerCase());
    const passwordIsValid = validator.isStrongPassword(password);

    return emailIsValid && passwordIsValid;
  }
}
