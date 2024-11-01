const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { PostService } = require("../services");
const { uploadFilesToS3 } = require("../utils/common/s3Uploader");

const CreatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    const mediaFiles = req.files;

    if (!text && !mediaFiles.length) {
      throw new AppError(
        "Empty post is not a valid post",
        StatusCodes.BAD_REQUEST
      );
    }

    const mediaData = await uploadFilesToS3(mediaFiles);

    let data = await PostService.CreatePost({
      userId,
      text,
      media: mediaData,
    });
    let response = SuccessResponse();
    response.data = data;
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    let errorResponse = ErrorResponse();
    errorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    return res.status(error.statusCode).json(errorResponse);
  }
};

const GetPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    let data = await PostService.GetPost(userId, postId);
    let response = SuccessResponse();
    response.data = data;
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    let errorResponse = ErrorResponse();
    errorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    return res.status(error.statusCode).json(errorResponse);
  }
};

const UpdatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { text, media } = req.body;
    const mediaFiles = req.files;
    if (!text && media.length == 0 && mediaFiles.length == 0) {
      throw new AppError(
        "Empty post is not a valid post",
        StatusCodes.BAD_REQUEST
      );
    }
    const mediaData = await uploadFilesToS3(mediaFiles);
    let data = await PostService.UpdatePost({
      postId,
      userId,
      text,
      media: [...media, ...mediaData],
    });
    let response = SuccessResponse();
    response.data = data;
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    let errorMessage = ErrorResponse();
    errorMessage.error = {
      explanation: error.explanation,
      details: error.details,
    };
    return res.status(error.statusCode).json(errorMessage);
  }
};

const DeletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    let data = await PostService.DeletePost({ userId, postId });
    let response = SuccessResponse();
    response.data = data;
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    let errorResponse = ErrorResponse();
    errorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    return res.status(error.statusCode).json(errorResponse);
  }
};

const GetFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit, page } = req.query;
    let data = await PostService.GetFeed({ userId, limit, page });
    let response = SuccessResponse();
    response.data = data;
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    let errorResponse = ErrorResponse();
    errorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    return res.status(error.statusCode).json(errorResponse);
  }
};

const GetUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit, page } = req.query;
    let data = await PostService.GetUserPosts({ userId, limit, page });
    let response = SuccessResponse();
    response.data = data;
    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    let errorResponse = ErrorResponse();
    errorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    return res.status(error.statusCode).json(errorResponse);
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
