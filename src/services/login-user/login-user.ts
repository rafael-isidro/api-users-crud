import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import { badRequest, ok, serverError } from "../../controllers/helpers";
import {
  HttpRequest,
  HttpResponse,
  IService,
} from "../../controllers/protocols";
import { IGetUserRepository, LoginUserParam } from "./protocols";

export class LoginUserService implements IService {
  constructor(private readonly getUserRepository: IGetUserRepository) {}
  async handle(
    httpRequest: HttpRequest<LoginUserParam>
  ): Promise<HttpResponse<{ userLogin: User; token: string } | string>> {
    try {
      const body = httpRequest!.body!;

      if (!body) {
        return badRequest("Missing fields");
      }

      const requiredFields = ["email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest!.body![field as keyof LoginUserParam]) {
          return badRequest(`Field ${field} is required`);
        }
      }

      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      if (!emailIsValid) {
        return badRequest("E-mail is invalid");
      }

      const user = await this.getUserRepository.getUserByEmail(body!.email);
      if (!user) {
        return badRequest("User not found.");
      }

      const verifyPassword = await bcrypt.compare(body.password, user.password);
      if (!verifyPassword) {
        return badRequest("E-mail or password is invalid");
      }

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
}
