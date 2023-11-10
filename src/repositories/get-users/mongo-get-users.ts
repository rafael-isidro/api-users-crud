import { IGetUsersRepository } from "../../services/get-users/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    const users = await MongoClient.db
      .collection<MongoUser>("users")
      .find({})
      .toArray();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ _id, password, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }
}
