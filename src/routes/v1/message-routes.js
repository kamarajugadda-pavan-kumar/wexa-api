const express = require("express");
const router = express.Router();
const { MessageController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// send a message
router.post(
  "/messages",
  [AuthMiddleware.validateJWTMiddleware],
  MessageController.CreateMessage
);

// Get Messages Between Two Users
router.get("/messages/conversation/:receiverId", [
  AuthMiddleware.validateJWTMiddleware,
  MessageController.GetMessagesBetweenUsers,
]);

// Get All Conversations for a User
router.get(
  "/messages/conversations",
  [AuthMiddleware.validateJWTMiddleware],
  MessageController.GetAllConversations
);

// Mark Messages as Read
router.post(
  "/messages/read",
  [AuthMiddleware.validateJWTMiddleware],
  MessageController.MarkMessagesAsRead
);

// Delete a Message
router.delete(
  "/messages/:messageId",
  [AuthMiddleware.validateJWTMiddleware],
  MessageController.DeleteMessage
);

module.exports = router;
