import { ObjectId } from "mongodb";
import { IDeleteUserRepository } from "../../services/delete-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";

export class MongoDeleteUserRepository implements IDeleteUserRepository {
  async deleteUser(id: string): Promise<User> {
    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new Error("Unauthorized.");
    }

    const { deletedCount } = await MongoClient.db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("User not deleted");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, password, ...rest } = user;
    return { id: _id.toHexString(), ...rest };
  }
}
