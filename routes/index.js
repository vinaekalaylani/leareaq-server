const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

router.post("/create-user", Controller.createUser);
router.post("/login", Controller.login);

module.exports = router;