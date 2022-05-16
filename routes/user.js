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
userRouter.get("/detail/:id", authorization, UserController.detailUser);
userRouter.patch("/update/:id", authorization, UserController.updateLeave);
userRouter.delete("/delete/:id", authorization, UserController.deleteUser);


module.exports = userRouter