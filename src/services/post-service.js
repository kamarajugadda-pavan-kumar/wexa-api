const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { Sequelize, Post, Media, User, sequelize } = require("../models");
const { GetFriendsList } = require("./friend-request-service");

const CreatePost = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const post = await Post.create(
      {
        userId: data.userId,
        text: data.text,
      },
      { transaction }
    );

    for (let media of data.media) {
      const { mediaType, mediaUrl } = media;
      await Media.create(
        { postId: post.id, mediaType, mediaUrl },
        { transaction }
      );
    }
    await transaction.commit();
    return post;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Error creating post",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetPost = async (userId, postId) => {
  try {
    const post = await Post.findOne({
      where: { userId, id: postId },
      include: [
        {
          model: Media,
          attributes: ["id", "mediaType", "mediaUrl"],
          as: "media",
        },
        {
          model: User,
          attributes: ["id", "username", "profilePicture"],
          as: "user",
        },
      ],
    });

    if (!post) {
      throw new AppError("Post not found", StatusCodes.NOT_FOUND);
    }

    return post;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error getting post", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const UpdatePost = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const post = await Post.findByPk(data.postId);

    if (!post) {
      throw new AppError("Post not found", StatusCodes.NOT_FOUND);
    }

    if (post.userId !== data.userId) {
      throw new AppError(
        "Unauthorized to update post",
        StatusCodes.UNAUTHORIZED
      );
    }

    await post.update({ text: data.text }, { transaction });
    const currMediaInDB = await Media.findAll({
      where: { postId: post.id },
      attributes: ["id"],
    });
    const mediaIdSet = new Set(
      currMediaInDB.map((media) => {
        return media.id;
      })
    );

    for (let media of data.media) {
      const { id, mediaType, mediaUrl } = media;
      if (!id) {
        await Media.create(
          { postId: post.id, mediaType, mediaUrl },
          { transaction }
        );
        continue;
      }
      mediaIdSet.delete(id);
    }

    for (let mediaId of mediaIdSet) {
      await Media.destroy({ where: { id: mediaId } }, { transaction });
    }
    await transaction.commit();
    return post;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Error updating post",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const DeletePost = async (data) => {
  try {
    const post = await Post.findByPk(data.postId);

    if (!post) {
      throw new AppError("Post not found", StatusCodes.NOT_FOUND);
    }

    if (post.userId !== data.userId) {
      throw new AppError(
        "Unauthorized to delete post",
        StatusCodes.UNAUTHORIZED
      );
    }

    await post.destroy();
    await Media.destroy({ where: { postId: post.id } });

    return post;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Error deleting post",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetFeed = async ({ userId, limit = 10, page = 1 }) => {
  try {
    const friends = await GetFriendsList(userId);
    const userIds = [userId, ...friends.map((friend) => friend.userId)];
    const offset = (page - 1) * limit;

    // Fetch posts from all userIds
    const posts = await Post.findAll({
      where: { userId: userIds }, // Use the array of userIds
      include: [
        {
          model: Media,
          attributes: ["id", "mediaType", "mediaUrl"],
          as: "media",
        },
        {
          model: User,
          attributes: ["id", "username", "profilePicture"],
          as: "user",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return posts;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Error fetching feed",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetUserPosts = async ({ userId, limit = 10, page = 1 }) => {
  try {
    const offset = (page - 1) * limit;
    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: Media,
          attributes: ["id", "mediaUrl", "mediaType"],
          as: "media",
        },
        {
          model: User,
          attributes: ["id", "username", "profilePicture"],
          as: "user",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    return posts;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Error fetching user's posts",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  CreatePost,
  GetPost,
  UpdatePost,
  DeletePost,
  GetFeed,
  GetUserPosts,
};
