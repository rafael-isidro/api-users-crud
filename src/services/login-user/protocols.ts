import { User } from "../../models/user";

export interface LoginUserParam {
  email: string;
  password: string;
}

export interface IGetUserRepository {
  getUserByEmail(email: string): Promise<User | null>;
}

export type JwtPayload = {
  id: number;
};
