import { ObjectId } from "mongodb";
import { User } from "../../models/user";

export interface LoginUserParam {
  email: string;
  password: string;
}

export interface IGetUserRepository {
  getUserByParam(
    param: { email: string } | { _id: ObjectId }
  ): Promise<User | null>;
}

export type JwtPayload = {
  id: number;
};
