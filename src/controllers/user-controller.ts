import { Request, Response } from "express";
import { MongoCreateUserRepository } from "../repositories/create-user/mongo-create-user";
import { MongoGetUserRepository } from "../repositories/get-user/mongo-get-user";
import { CreateUserService } from "../services/create-user/create-user";
import { LoginUserService } from "../services/login-user/login-user";
import { MongoGetUsersRepository } from "../repositories/get-users/mongo-get-users";
import { GetUsersService } from "../services/get-users/get-users";
import { MongoUpdateUserRepository } from "../repositories/update-user/mongo-update-user";
import { UpdateUserService } from "../services/update-user/update-user";
import { MongoDeleteUserRepository } from "../repositories/delete-user/mongo-delete-user";
import { DeleteUserService } from "../services/delete-user/delete-user";
import { serverError } from "./helpers";

export const createUserController = async (req: Request, res: Response) => {
  const mongoCreateUserRepository = new MongoCreateUserRepository();
  const createUserService = new CreateUserService(mongoCreateUserRepository);

  const { body, statusCode } = await createUserService.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
};

export const loginUserController = async (req: Request, res: Response) => {
  const mongoGetUserRepository = new MongoGetUserRepository();
  const loginUserService = new LoginUserService(mongoGetUserRepository);

  const { body, statusCode } = await loginUserService.handle({
    body: req.body,
  });

  res.status(statusCode).send(body);
};

export const getUsersController = async (_: Request, res: Response) => {
  try {
    const mongoGetUsersRepository = new MongoGetUsersRepository();
    const getUsersService = new GetUsersService(mongoGetUsersRepository);

    const { body, statusCode } = await getUsersService.handle();

    res.status(statusCode).send(body);
  } catch (error) {
    return serverError();
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const mongoUpdateUserRepository = new MongoUpdateUserRepository();
  const updateUserService = new UpdateUserService(mongoUpdateUserRepository);

  const { body, statusCode } = await updateUserService.handle(
    {
      body: req.body,
      params: req.params,
    },
    res
  );

  res.status(statusCode).send(body);
};

export const deleteUserController = async (req: Request, res: Response) => {
  const mongoDeleteUserRepository = new MongoDeleteUserRepository();
  const deleteUserService = new DeleteUserService(mongoDeleteUserRepository);

  const { body, statusCode } = await deleteUserService.handle(
    {
      params: req.params,
    },
    res
  );

  res.status(statusCode).send(body);
};
