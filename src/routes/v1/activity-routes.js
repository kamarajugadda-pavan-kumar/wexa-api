const express = require("express");
const router = express.Router();
const { ActivityController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// get user activity
router.get(
  "/activity",
  [AuthMiddleware.validateJWTMiddleware],
  ActivityController.GetUserActivity
);

module.exports = router;
