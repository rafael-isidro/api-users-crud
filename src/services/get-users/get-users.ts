import { User } from "../../models/user";
import { ok, serverError } from "../../controllers/helpers";
import { HttpResponse } from "../../controllers/protocols";
import { IGetUsersRepository } from "./protocols";
import { IService } from "../protocols";

export class GetUsersService implements IService {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle(): Promise<HttpResponse<User[] | string>> {
    try {
      const users = await this.getUsersRepository.getUsers();

      return ok<User[]>(users);
    } catch (error) {
      return serverError();
    }
  }
}
