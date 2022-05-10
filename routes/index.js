const express = require("express");
const Controller = require("../controllers");
const authentication = require(`../middlewares/authentication`) 
const router = express.Router();

router.post("/login", Controller.login);
router.use(authentication)

router.get("/list", Controller.list);
router.get("/list-user", Controller.listUser);
router.get("/list-user-id", Controller.listById);

router.post("/create-user", Controller.createUser);
router.post("/request", Controller.reqLeave);

router.put("/approve/:id", Controller.appLeave)

module.exports = router;