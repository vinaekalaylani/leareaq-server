const express = require('express')
const leaveRouter = express.Router()
const LeaveController = require('../controllers/leave')
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

leaveRouter.use(authentication);

leaveRouter.post("/create", LeaveController.create);
leaveRouter.get("/list", LeaveController.list);
leaveRouter.get("/history", LeaveController.history);
leaveRouter.get("/list/:id", LeaveController.detail);
leaveRouter.patch("/update/:id", authorization, LeaveController.appLeave);


module.exports = leaveRouter