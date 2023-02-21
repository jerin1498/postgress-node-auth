const express = require("express");
const { verifySignUp } = require("../../middleware");
const controller = require("../../controllers/auth.controller");

const router = express.Router();

router.post(
  "/auth/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  controller.signup
);

router.post("/auth/signin", controller.signin);

module.exports = router;
