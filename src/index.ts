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
import { VerifyUserFields } from "./middlewares/verify-fields";

const main = async () => {
  config();

  const app = express();
  app.use(express.json());
  const PORT = process.env.PORT || 8000;
  const verifyUserFields = new VerifyUserFields();
  await MongoClient.connect();

  app.post("/users", verifyUserFields.createVerify, createUserController);
  app.post("/login", verifyUserFields.loginVerify, loginUserController);

  const authMiddleware = new AuthMiddleware();
  app.use(authMiddleware.handle);

  app.get("/users", getUsersController);
  app.patch(
    "/users/:id",
    verifyUserFields.idVerify,
    verifyUserFields.updateVerify,
    updateUserController
  );
  app.delete(
    "/users/:id",
    verifyUserFields.idVerify,
    verifyUserFields.deleteVerify,
    deleteUserController
  );

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

main();
