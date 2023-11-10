import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "../../controllers/helpers";
import { HttpRequest, HttpResponse } from "../../controllers/protocols";
import { IGetUserRepository, LoginUserParam } from "./protocols";
import { IService } from "../protocols";

export class LoginUserService implements IService {
  constructor(private readonly getUserRepository: IGetUserRepository) {}
  async handle(
    httpRequest: HttpRequest<LoginUserParam>
  ): Promise<HttpResponse<{ userLogin: User; token: string } | string>> {
    try {
      const body = httpRequest!.body!;

      const isValidEmailAndPassword = await this.verifyEmailAndPassword(
        body.email,
        body.password
      );
      if (!isValidEmailAndPassword)
        return badRequest("E-mail or password is invalid");

      const user = await this.getUserRepository.getUserByParam({
        email: body!.email,
      });
      if (!user) return notFound("User not found.");

      const verifyPassword = await bcrypt.compare(
        body.password,
        user.password!
      );
      if (!verifyPassword) return badRequest("E-mail or password is invalid");

      const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
        expiresIn: "8h",
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userLogin } = user;
      const response = { user: userLogin, token };
      return ok(response);
    } catch (error) {
      return serverError();
    }
  }
  async verifyEmailAndPassword(email: string, password: string) {
    const emailIsValid = validator.isEmail(email.toLowerCase());
    const passwordIsValid = validator.isStrongPassword(password);

    return emailIsValid && passwordIsValid;
  }
}
