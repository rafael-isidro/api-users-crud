import { IGetUserRepository } from "../../services/login-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";

export class MongoGetUserRepository implements IGetUserRepository {
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ email });

    if (!user) {
      return null;
    }

    const { _id, ...rest } = user;

    return { id: _id.toHexString(), ...rest };
  }
}
