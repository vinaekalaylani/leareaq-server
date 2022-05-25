const express = require('express')
const userRouter = express.Router()
const UserController = require('../controllers/user')
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

userRouter.post("/login", UserController.login);

userRouter.use(authentication);

userRouter.get("/user-login", UserController.userLogin)
userRouter.get("/list", UserController.listUser)
userRouter.get("/initial", UserController.initialUser)
userRouter.post("/create", authorization, UserController.createUser);
userRouter.get("/detail/:id", UserController.detailUser);
userRouter.put("/update/:id", authorization, UserController.updateUser);
userRouter.patch("/delete/:id", authorization, UserController.deleteUser);
userRouter.patch("/update-leave/:id", authorization, UserController.updateLeave);

module.exports = userRouter