const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { MessageService } = require("../services");
const AppError = require("../utils/errors/app-error");

const CreateMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;
    if (!receiverId || !message) {
      throw new AppError(
        "ReceiverId and message are required",
        StatusCodes.BAD_REQUEST
      );
    }

    let data = await MessageService.CreateMessage({
      senderId,
      receiverId,
      message,
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

const GetMessagesBetweenUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.params;

    let data = await MessageService.GetMessagesBetweenUsers(userId, receiverId);
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

const GetAllConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    let data = await MessageService.GetAllConversations(userId);
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

const MarkMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { senderId } = req.body;
    if (!senderId) {
      throw new AppError("senderId is required", StatusCodes.BAD_REQUEST);
    }

    let data = await MessageService.MarkMessagesAsRead(userId, senderId);
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

const DeleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    let data = await MessageService.DeleteMessage(userId, messageId);
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
  CreateMessage,
  GetMessagesBetweenUsers,
  GetAllConversations,
  MarkMessagesAsRead,
  DeleteMessage,
};
