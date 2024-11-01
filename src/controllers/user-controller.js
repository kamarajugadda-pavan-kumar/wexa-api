const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { UserService } = require("../services");
const AppError = require("../utils/errors/app-error");
const { logUserActivity } = require("../services/activity-service");
const { activityTypes } = require("../utils/common/enums");
const { USER_UPDATED_PROFILE } = activityTypes;
const { uploadFileToS3 } = require("../utils/common/s3Uploader");

const UserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let data = await UserService.GetUserProfile(userId);
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

const UpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;
    if (req.file) {
      const { mediaUrl } = await uploadFileToS3(req.file);
      updatedData.profilePicture = mediaUrl;
    }
    let data = await UserService.UpdateUserProfile(userId, updatedData);
    let response = SuccessResponse();
    response.data = data;

    await logUserActivity(userId, USER_UPDATED_PROFILE, "");
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

const ToggleTwoFactorAuth = async (req, res) => {
  const { enabled } = req.body;
  const userId = req.user.id;
  let response = SuccessResponse();
  try {
    let data;
    if (enabled) {
      data = await UserService.EnableTwoFactorAuth(userId);
    } else {
      data = await UserService.DisableTwoFactorAuth(userId);
    }
    response.data = data;
    response.message = `Two-factor authentication has been ${
      enabled ? "enabled" : "disabled"
    }.`;
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

module.exports = { UserProfile, UpdateUserProfile, ToggleTwoFactorAuth };
