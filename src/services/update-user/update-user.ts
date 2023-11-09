import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../../models/user";
import { IUpdateUserRepository, UpdateUserParams } from "./protocols";
import {
  HttpRequest,
  HttpResponse,
  IService,
} from "../../controllers/protocols";
import { badRequest, ok, serverError } from "../../controllers/helpers";
import { MongoGetUserRepository } from "../../repositories/get-user/mongo-get-user";

export class UpdateUserService implements IService {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest?.params?.id;
      const body = httpRequest?.body;

      if (!id) {
        return badRequest("Missing user id");
      }

      if (!body) {
        return badRequest("Missing fields");
      }

      const allowedFieldsToUpdate: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "password",
        "email",
      ];
      const someFieldNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
      );

      if (someFieldNotAllowedToUpdate) {
        return badRequest("Some recieved field is not allowed");
      }

      const mongoGetUserRepository = new MongoGetUserRepository();
      if (body.email) {
        const emailExists = await mongoGetUserRepository.getUserByEmail(
          body!.email!
        );

        if (emailExists) {
          return badRequest("E-mail already exists.");
        }

        const emailIsValid = validator.isEmail(body!.email!);

        if (!emailIsValid) {
          return badRequest("E-mail is invalid.");
        }
      }
      if (body.password) {
        const passwordIsValid = validator.isStrongPassword(body!.password);

        if (!passwordIsValid) {
          return badRequest(
            "Your password must be have at least 8 characters long, combination of uppercase and lowercase letters, 1 special character and 1 numeric digit."
          );
        }
        const hashPassword = await bcrypt.hash(body.password, 10);
        body.password = hashPassword;
      }
      const user = await this.updateUserRepository.updateUser(id, body);

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
