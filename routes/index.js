const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const leaveRouter = require("./leave");
const errorHandler = require('../middlewares/errorHandler');

router.use("/user", userRouter);
router.use("/leave", leaveRouter);

router.use(errorHandler)

module.exports = router;