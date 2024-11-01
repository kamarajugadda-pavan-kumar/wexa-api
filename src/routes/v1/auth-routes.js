const express = require("express");
const router = express.Router();
const {
  AuthController,
  FriendRequestController,
} = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// sign up a user
router.post(
  "/auth/sign-up",
  [AuthMiddleware.authMiddlewareSignUp],
  AuthController.signUp
);

// verify the user email address
router.get("/auth/verify-email", AuthController.verifyEmail);

// sign in user
router.post(
  "/auth/sign-in",
  [AuthMiddleware.authMiddlewareSignIn],
  AuthController.signIn
);

// logout user
router.post("/auth/logout", AuthController.logout);

module.exports = router;
