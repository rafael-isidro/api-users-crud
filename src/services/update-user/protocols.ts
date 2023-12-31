import { User } from "../../models/user";

export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
}

export interface IUpdateUserRepository {
  updateUser(id: string, params: UpdateUserParams): Promise<User | null>;
}
