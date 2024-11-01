const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { UserController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

const upload = multer({
  limits: { fileSize: 2 * 1024 * 1024 },
});

// get user profile
router.get(
  "/user/profile",
  [AuthMiddleware.validateJWTMiddleware],
  UserController.UserProfile
);

// update user profile
router.patch(
  "/user/profile",
  [AuthMiddleware.validateJWTMiddleware, upload.single("profilePicture")],
  UserController.UpdateUserProfile
);

router.put(
  "/user/profile/2fa",
  [AuthMiddleware.validateJWTMiddleware],
  UserController.ToggleTwoFactorAuth
);

module.exports = router;
