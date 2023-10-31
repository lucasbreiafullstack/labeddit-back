import express from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserController } from "../controller/UserController";
import { UserDatabase } from "../database/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/hashManager";
import { TokenManager } from "../services/tokenManager";

export const userRouter = express.Router();

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new TokenManager(),
        new IdGenerator(),
        new HashManager()
    )
);

userRouter.get('/', userController.getUsers);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login)