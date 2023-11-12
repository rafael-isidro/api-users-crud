import { Request, Response, NextFunction } from "express";
import { CreateUserParams } from "../services/create-user/protocols";
import { badRequest, unauthorized } from "../controllers/helpers";
import { LoginUserParam } from "../services/login-user/protocols";
import { UpdateUserParams } from "../services/update-user/protocols";

export class VerifyUserFields {
  private static validateRequiredFields(
    req: Request,
    res: Response,
    next: NextFunction,
    requiredFields: string[]
  ) {
    if (!req.body) {
      const response = badRequest(`Missing Fields.`);
      return res.status(response.statusCode).send(response.body);
    }

    for (const field of requiredFields) {
      if (
        !req.body?.[field as keyof CreateUserParams | keyof LoginUserParam]
          ?.length
      ) {
        const response = badRequest(`Field ${field} is required.`);
        return res.status(response.statusCode).send(response.body);
      }
    }

    next();
  }

  async createVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const requiredFields = ["firstName", "lastName", "email", "password"];
    VerifyUserFields.validateRequiredFields(req, res, next, requiredFields);
  }

  async loginVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const requiredFields = ["email", "password"];
    VerifyUserFields.validateRequiredFields(req, res, next, requiredFields);
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

  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
  );

  if (invalidFields.length > 0) {
    const response = badRequest(`Invalid field(s) for update: ${invalidFields.join(", ")}`);
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
