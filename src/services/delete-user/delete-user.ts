import { User } from "../../models/user";
import { ok, serverError, unauthorized } from "../../controllers/helpers";
import { HttpRequest, HttpResponse } from "../../controllers/protocols";
import { IDeleteUserRepository } from "./protocols";
import { IService } from "../protocols";
import { Response } from "express";

export class DeleteUserService implements IService {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(
    httpRequest: HttpRequest<any>,
    httpResponse: Response
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest.params?.id;

      if (id !== httpResponse.locals.user.id)
        return unauthorized("Unauthorized");

      const user = await this.deleteUserRepository.deleteUser(id);

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
