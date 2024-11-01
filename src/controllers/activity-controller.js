const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { ActivityService } = require("../services");

const GetUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const activity = await ActivityService.GetUserActivity(userId);
    let response = SuccessResponse();
    response.data = activity;
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
module.exports = { GetUserActivity };
