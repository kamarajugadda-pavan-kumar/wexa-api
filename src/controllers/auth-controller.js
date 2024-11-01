const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { AuthService } = require("../services");
const { logUserActivity } = require("../services/activity-service");
const { activityTypes } = require("../utils/common/enums");
const { USER_CREATED, USER_LOGIN } = activityTypes;

const signUp = async (req, res) => {
  try {
    let data = await AuthService.signUp(req.body);
    let response = SuccessResponse();
    response.data = data.successMessage;
    await logUserActivity(data.userId, USER_CREATED, "User Created ");
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

const signIn = async (req, res) => {
  try {
    let { token, userId, username, email, profilePicture, twoFactorEnabled } =
      await AuthService.signIn(req.body);
    let response = SuccessResponse();
    if (twoFactorEnabled) {
      response.message = "TOTP required";
      response.data = {
        username,
        email,
        profilePicture,
        twoFactorEnabled,
      };
      return res.status(StatusCodes.OK).json(response);
    }
    response.data = "Login successful";
    await logUserActivity(userId, USER_LOGIN, "User Logged In ");

    res.cookie("authToken", token, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: false,
    });
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

const verifyEmail = async (req, res) => {
  try {
    let data = await AuthService.verifyEmail(req.query.token);
    let response = SuccessResponse();
    response.data = data.successMessage;
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

const logout = (req, res) => {
  res.clearCookie("authToken");
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  signUp,
  signIn,
  verifyEmail,
  logout,
};
