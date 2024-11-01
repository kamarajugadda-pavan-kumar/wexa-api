const express = require("express");
const router = express.Router();
const { FriendRequestController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");
// const {} = require("../../middlewares");

// send a friend request (WSS)
router.post(
  "/friend-requests",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.CreateFriendRequest
);

// View received Friend Requests (WSS)
router.get(
  "/friend-requests-received",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.GetReceivedFriendRequests
);

// View sent Friend Requests
router.get(
  "/friend-requests-sent",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.GetSentFriendRequests
);

// Accept a Friend Request (WSS)
router.put(
  "/friend-requests/:requestId/accept",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.AcceptFriendRequest
);

// Reject a Friend Request (WSS)
router.put(
  "/friend-requests/:requestId/reject",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.RejectFriendRequest
);

// Delete(cancel) a pending Friend Request (WSS)
router.delete(
  "/friend-requests/:requestId",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.DeleteFriendRequest
);

// View Friends List
router.get(
  "/friends",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.GetFriendsList
);

// Check Friendship Status
router.get(
  "/friend-status/:friendId",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.GetFriendStatus
);

// search for users
router.get(
  "/friends/search",
  [AuthMiddleware.validateJWTMiddleware],
  FriendRequestController.SearchUsers
);

module.exports = router;
