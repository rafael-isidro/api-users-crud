import { IGetUserRepository } from "../../services/login-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";
import { ObjectId } from "mongodb";

export class MongoGetUserRepository implements IGetUserRepository {
  async getUserByParam(
    param: { email: string } | { _id: ObjectId }
  ): Promise<User | null> {
    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne(param);

    if (!user) return null;

    const { _id, ...rest } = user;

    return { id: _id.toHexString(), ...rest };
  }
}
