import { IGetUsersRepository } from "../../controllers/get-users/protocols";
import { User } from "../../models/user";

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    return [
      {
        firstName: "José",
        lastName: "Silva",
        email: "jose@email.com",
        password: "123",
      },
    ];
  }
}
