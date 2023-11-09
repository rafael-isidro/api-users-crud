import { User } from "../../models/user";
import { badRequest, ok, serverError } from "../../controllers/helpers";
import {
  HttpRequest,
  HttpResponse,
  IService,
} from "../../controllers/protocols";
import { IDeleteUserRepository } from "./protocols";

export class DeleteUserService implements IService {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = httpRequest.params?.id;

      if (!id) {
        return badRequest("Missing user id");
      }

      const user = await this.deleteUserRepository.deleteUser(id);

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
