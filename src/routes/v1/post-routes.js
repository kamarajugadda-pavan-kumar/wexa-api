const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const { PostController } = require("../../controllers");
const { AuthMiddleware } = require("../../middlewares");

// create a post
router.post(
  "/post",
  [AuthMiddleware.validateJWTMiddleware, upload.array("media")],
  PostController.CreatePost
);

// get a post by id
router.get(
  "/post/:postId",
  [AuthMiddleware.validateJWTMiddleware],
  PostController.GetPost
);

// update a post
router.put(
  "/post/:postId",
  [AuthMiddleware.validateJWTMiddleware, upload.array("media")],
  PostController.UpdatePost
);

// delete a post
router.delete(
  "/post/:postId",
  [AuthMiddleware.validateJWTMiddleware],
  PostController.DeletePost
);

// get the feed
router.get(
  "/feed",
  [AuthMiddleware.validateJWTMiddleware],
  PostController.GetFeed
);

// get the posts of a user
router.get(
  "/user/:userId/posts",
  [AuthMiddleware.validateJWTMiddleware],
  PostController.GetUserPosts
);

module.exports = router;
