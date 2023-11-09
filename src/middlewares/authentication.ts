import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { HttpResponse } from "../controllers/protocols";
import { JwtPayload } from "../services/login-user/protocols";
import { notFound, serverError, unauthorized } from "../controllers/helpers";
import { ObjectId } from "mongodb";
import { MongoClient } from "../database/mongo";
import { MongoUser } from "../repositories/mongo-protocols";

export class AuthMiddleware {
  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<HttpResponse<string> | Response | void> {
    try {
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

      const user = await MongoClient.db
        .collection<MongoUser>("users")
        .findOne({ _id: new ObjectId(id) });

      if (!user) {
        const { body, statusCode } = notFound("User not found");
        return res.status(statusCode).send(body);
      }
      const { _id, ...rest } = user;

      const result = { id: _id.toHexString(), ...rest };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userLogged } = result;

      res.locals.user = userLogged;

      next();
    } catch (error) {
      return serverError();
    }
  }
}