const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { FriendRequestService } = require("../services");
const AppError = require("../utils/errors/app-error");
const { logUserActivity } = require("../services/activity-service");
const { activityTypes } = require("../utils/common/enums");
const { FRIEND_REQUEST_CREATED, FRIEND_ACCEPTED, FRIEND_REJECTED } =
  activityTypes;

const CreateFriendRequest = async (req, res) => {
  try {
    const receiverId = req.body.receiverId;
    const senderId = req.user.id;
    if (receiverId == senderId) {
      throw new AppError(
        "Cannot send friend request to yourself",
        StatusCodes.BAD_REQUEST
      );
    }
    console.log(receiverId, senderId);
    let data = await FriendRequestService.CreateFriendRequest({
      receiverId,
      senderId,
    });
    let response = SuccessResponse();
    response.data = data;
    await logUserActivity(senderId, FRIEND_REQUEST_CREATED, "", receiverId);
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

const GetReceivedFriendRequests = async (req, res) => {
  try {
    let data = await FriendRequestService.GetReceivedFriendRequests(
      req.user.id
    );
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

const GetSentFriendRequests = async (req, res) => {
  try {
    let data = await FriendRequestService.GetSentFriendRequests(req.user.id);
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

const AcceptFriendRequest = async (req, res) => {
  try {
    let data = await FriendRequestService.AcceptFriendRequest(
      req.params.requestId
    );
    let response = SuccessResponse();
    response.data = data;
    console.log(data, "AcceptFriendRequest");
    await logUserActivity(
      data.senderId,
      FRIEND_ACCEPTED,
      "This is a accepted Friend request",
      data.receiverId
    );

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

const RejectFriendRequest = async (req, res) => {
  try {
    let data = await FriendRequestService.RejectFriendRequest(
      req.params.requestId
    );
    let response = SuccessResponse();
    response.data = data;
    console.log(data, "RejectFriendRequest");
    await logUserActivity(
      data.senderId,
      FRIEND_REJECTED,
      "This is rejected Friend request",
      data.receiverId
    );
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

const DeleteFriendRequest = async (req, res) => {
  try {
    let data = await FriendRequestService.DeleteFriendRequest(
      req.params.requestId
    );
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

const GetFriendsList = async (req, res) => {
  try {
    let data = await FriendRequestService.GetFriendsList(req.user.id);
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

const GetFriendStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    let data = await FriendRequestService.GetFriendStatus(
      userId,
      req.params.friendId
    );

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

const SearchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const userId = req.user.id;
    let data = await FriendRequestService.SearchUsers(keyword, userId);
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
  CreateFriendRequest,
  GetReceivedFriendRequests,
  GetSentFriendRequests,
  AcceptFriendRequest,
  RejectFriendRequest,
  DeleteFriendRequest,
  GetFriendsList,
  GetFriendStatus,
  SearchUsers,
};
