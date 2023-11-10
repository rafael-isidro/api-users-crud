import { Request, Response, NextFunction } from "express";
import { CreateUserParams } from "../services/create-user/protocols";
import { badRequest, unauthorized } from "../controllers/helpers";
import { LoginUserParam } from "../services/login-user/protocols";
import { UpdateUserParams } from "../services/update-user/protocols";

export class VerifyUserFields {
  async createVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const requiredFields = ["firstName", "lastName", "email", "password"];

    for (const field of requiredFields) {
      if (!req.body?.[field as keyof CreateUserParams]?.length) {
        const response = badRequest(`Field ${field} is required.`);
        return res.status(response.statusCode).send(response.body);
      }
    }
    next();
  }

  async loginVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    if (!req.body) {
      const response = badRequest(`Missing fields.`);
      return res.status(response.statusCode).send(response.body);
    }

    const requiredFields = ["email", "password"];

    for (const field of requiredFields) {
      if (!req.body?.[field as keyof LoginUserParam]?.length) {
        const response = badRequest(`Field ${field} is required.`);
        return res.status(response.statusCode).send(response.body);
      }
    }
    next();
  }

  async updateVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const allowedFieldsToUpdate: (keyof UpdateUserParams)[] = [
      "firstName",
      "lastName",
      "password",
      "email",
    ];

    const allowedField = Object.keys(req.body).find((key) =>
      allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
    );

    if (!allowedField) {
      const response = badRequest(`Some field is not allowed for update`);
      return res.status(response.statusCode).send(response.body);
    }

    next();
  }

  async deleteVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { userId } = req.params;
    const { userAuthId } = res.locals.user;

    if (userId !== userAuthId) {
      const response = unauthorized("Unauthorized");
      return res.status(response.statusCode).send(response.body);
    }

    next();
  }

  async idVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const id = req.params.id;

    if (!id) {
      const response = badRequest("Missing user id");
      return res.status(response.statusCode).send(response.body);
    }
    next();
  }
}
