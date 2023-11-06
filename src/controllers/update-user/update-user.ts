import { User } from "../../models/user";
import {
  IUpdateUserRepository,
  UpdateUserParams,
} from "../update-user/protocols";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { badRequest, ok, serverError } from "../helpers";

export class UpdateUserController implements IController {
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
      ];
      const someFieldNotAllowedToUpdate = Object.keys(body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
      );

      if (someFieldNotAllowedToUpdate) {
        return badRequest("Some recieved field is not allowed");
      }

      const user = await this.updateUserRepository.updateUser(id, body);

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
