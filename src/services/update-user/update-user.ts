import validator from "validator";
import bcrypt from "bcrypt";
import { User } from "../../models/user";
import { IUpdateUserRepository, UpdateUserParams } from "./protocols";
import { HttpRequest, HttpResponse } from "../../controllers/protocols";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../controllers/helpers";
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

      if (!id) return badRequest("Missing user id");
      if (!body) return badRequest("Missing fields");

      if (body.email) {
        const { id: authId } = httpResponse.locals.user;
        const isValidEmail = await this.verifyEmail(
          authId,
          body.email.toLowerCase()
        );
        if (!isValidEmail) return badRequest("Email is not valid");
      }
      if (id !== httpResponse.locals.user.id)
        return unauthorized("Unauthorized");
      if (body.password) {
        const isValidPassword = this.verifyPassword(body.password);
        if (!isValidPassword)
          return badRequest(
            "Your password must be have at least 8 characters long, combination of uppercase and lowercase letters, 1 special character and 1 numeric digit."
          );
        body.password = await bcrypt.hash(body.password, 10);
      }
      const user = await this.updateUserRepository.updateUser(id, body);
      if (!user) return badRequest("User not found");

      if (user.password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userUpdated } = user;
        return ok<User>(userUpdated);
      }

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }

  async verifyEmail(
    authId: string,
    email: string
  ): Promise<HttpResponse<string> | boolean> {
    const mongoGetUserRepository = new MongoGetUserRepository();
    const userByEmail = await mongoGetUserRepository.getUserByParam({
      email,
    });

    const userById = await mongoGetUserRepository.getUserByParam({
      _id: new ObjectId(authId),
    });

    const emailIsValid = validator.isEmail(email!);
    if (userByEmail && email !== userById!.email) {
      return false;
    }

    return emailIsValid;
  }

  async verifyPassword(password: string): Promise<boolean> {
    return validator.isStrongPassword(password);
  }
}
