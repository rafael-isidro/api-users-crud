import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { HttpResponse } from "../controllers/protocols";
import { JwtPayload } from "../services/login-user/protocols";
import { unauthorized } from "../controllers/helpers";
import { ObjectId } from "mongodb";
import { MongoGetUserRepository } from "../repositories/get-user/mongo-get-user";

export class AuthMiddleware {
  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<HttpResponse<string> | Response | void> {
    try {
      const mongoGetUserRepository = new MongoGetUserRepository();
      const { authorization } = req.headers;

      if (!authorization) {
        const { body, statusCode } = unauthorized("Unauthorized");
        return res.status(statusCode).send(body);
      }

      const token = authorization.split(" ")[1];
      const { id } = jwt.verify(
        token,
        process.env.JWT_PASS ?? ""
      ) as JwtPayload;
      const user = await mongoGetUserRepository.getUserByParam({ _id: new ObjectId(id) })

      if (!user) {
        const { body, statusCode } = unauthorized("Unauthorized");
        return res.status(statusCode).send(body);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userLogged } = user;
      res.locals.user = userLogged;

      next();
    } catch (error) {
      const { body, statusCode } = unauthorized("Invalid Token");
      return res.status(statusCode).send(body);
    }
  }
}
