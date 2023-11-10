import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../../models/user";
import { IUpdateUserRepository, UpdateUserParams } from "./protocols";
import { HttpRequest, HttpResponse } from "../../controllers/protocols";
import { badRequest, ok, serverError } from "../../controllers/helpers";
import { MongoGetUserRepository } from "../../repositories/get-user/mongo-get-user";
import { IService } from "../protocols";
import { Response } from "express";
import { ObjectId } from "mongodb";

export class UpdateUserService implements IService {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<UpdateUserParams>,
    httpResponse: Response
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
        const { id } = httpResponse.locals.user;
        body.email = body.email.toLowerCase();

        const userByEmail = await mongoGetUserRepository.getUserByParam({
          email: body.email,
        });
        const userById = await mongoGetUserRepository.getUserByParam({
          _id: new ObjectId(id),
        });

        if (userByEmail && body.email !== userById!.email) {
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
