import express from "express";
import { config } from "dotenv";
import { MongoClient } from "./database/mongo";
import {
  createUserController,
  deleteUserController,
  getUsersController,
  loginUserController,
  updateUserController,
} from "./controllers/user-controller";
import { AuthMiddleware } from "./middlewares/authentication";

const main = async () => {
  config();

  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 8000;
  await MongoClient.connect();

  app.post("/users", createUserController);
  app.post("/login", loginUserController);

  const authMiddleware = new AuthMiddleware();
  app.use(authMiddleware.handle);

  app.get("/users", getUsersController);
  app.patch("/users/:id", updateUserController);
  app.delete("/users/:id", deleteUserController);

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

main();
