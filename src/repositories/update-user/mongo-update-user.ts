import { ObjectId } from "mongodb";
import {
  IUpdateUserRepository,
  UpdateUserParams,
} from "../../services/update-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";

export class MongoUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(id: string, params: UpdateUserParams): Promise<User | null> {
    await MongoClient.db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...params,
        },
      }
    );

    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) return null;

    const { _id, ...rest } = user;

    return { id: _id.toHexString(), ...rest };
  }
}
