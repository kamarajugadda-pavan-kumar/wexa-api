const { StatusCodes } = require("http-status-codes");
const { FriendRequestRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Sequelize, FriendRequest, User } = require("../models");
const { friendRequestStatus } = require("../utils/common/enums");
const { getWSS } = require("../webSocket/init");
const { ACCEPTED, REJECTED, PENDING } = friendRequestStatus;

const CreateFriendRequest = async (data) => {
  try {
    const { senderId, receiverId } = data;
    // Check if both users are valid
    const existingRequest = await FriendRequest.findOne({
      where: {
        [Sequelize.Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
    if (existingRequest) {
      throw new AppError("Friend request already exists", StatusCodes.CONFLICT);
    }

    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
      status: PENDING,
    });
    const receiver = await User.findByPk(receiverId, {
      attributes: ["id", "username", "email", "profilePicture"],
    });

    const WSS = getWSS();

    WSS.sendToClient(receiverId, {
      message: "FRIEND_REQUEST_CREATED",
      data: {
        requestId: friendRequest.id,
        senderId: friendRequest.senderId,
        receiverId: friendRequest.receiverId,
        status: friendRequest.status,
        receiver,
      },
    });

    return {
      requestId: friendRequest.id,
      senderId: friendRequest.senderId,
      receiverId: friendRequest.receiverId,
      receiverName: receiver.username,
      receiverEmail: receiver.email,
      receiverProfilePicture: receiver.profilePicture,
      status: friendRequest.status,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to create friend request",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetReceivedFriendRequests = async (userId) => {
  try {
    const requests = await FriendRequest.findAll({
      where: { receiverId: userId, status: PENDING },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "username", "email", "profilePicture"],
        },
      ],
    });

    const response = requests.map((request) => ({
      requestId: request.id,
      senderId: request.senderId,
      senderName: request.Sender?.username,
      senderEmail: request.Sender?.email,
      senderProfilePicture: request.Sender?.profilePicture,
      receiverId: request.receiverId,
      status: request.status,
    }));
    return response;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch received friend requests",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetSentFriendRequests = async (userId) => {
  try {
    const requests = await FriendRequest.findAll({
      where: { senderId: userId, status: PENDING },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "Receiver",
          attributes: ["id", "username", "email", "profilePicture"],
        },
      ],
    });
    return requests.map((request) => ({
      requestId: request.id,
      senderId: request.senderId,
      receiverId: request.receiverId,
      receiverName: request.Receiver?.username,
      receiverEmail: request.Receiver?.email,
      receiverProfilePicture: request.Receiver?.profilePicture,
      status: request.status,
    }));
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch sent friend requests",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const AcceptFriendRequest = async (friendRequestId) => {
  try {
    const request = await new FriendRequestRepository().getResource(
      friendRequestId
    );
    if (!request) {
      throw new AppError("Friend request not found", StatusCodes.NOT_FOUND);
    }
    const receiver = await User.findByPk(request.receiverId, {
      attributes: [
        "id",
        "username",
        "email",
        "profilePicture",
        "role",
        "lastLogin",
      ],
    });
    const sender = await User.findByPk(request.senderId, {
      attributes: [
        "id",
        "username",
        "email",
        "profilePicture",
        "role",
        "lastLogin",
      ],
    });

    // If the request is pending, update its status to 'accepted'
    if (request.status === PENDING) {
      await request.update({ status: "accepted" });
      const WSS = getWSS();
      WSS.sendToClient(request.senderId, {
        message: "FRIEND_REQUEST_ACCEPTED",
        data: {
          requestId: request.id,
          userId: receiver.id,
          name: receiver.username,
          email: receiver.email,
          role: receiver.role,
          lastLogin: receiver.lastLogin,
        },
      });
      return {
        requestId: request.id,
        receiverId: receiver.id,
        senderId: sender.id,
        userId: sender.id,
        name: sender.username,
        email: sender.email,
        role: sender.role,
        lastLogin: sender.lastLogin,
      };
    } else if (request.status === ACCEPTED) {
      throw new AppError(
        "Friend request is already accepted",
        StatusCodes.BAD_REQUEST
      );
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to accept friend request",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const RejectFriendRequest = async (friendRequestId) => {
  try {
    const requestData = await FriendRequest.findByPk(friendRequestId);
    const request = await new FriendRequestRepository().deleteResource(
      friendRequestId
    );
    const WSS = getWSS();
    WSS.sendToClient(requestData.senderId, {
      message: "FRIEND_REQUEST_REJECTED",
      data: { requestId: requestData.id },
    });
    return { ...requestData, status: REJECTED };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to reject friend request",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const DeleteFriendRequest = async (friendRequestId) => {
  try {
    const requestData = await FriendRequest.findByPk(friendRequestId);
    if (!requestData) {
      throw new AppError("Friend request not found", StatusCodes.NOT_FOUND);
    }
    const request = await new FriendRequestRepository().deleteResource(
      friendRequestId
    );
    const WSS = getWSS();

    WSS.sendToClient(requestData.receiverId, {
      message: "FRIEND_REQUEST_DELETED",
      data: { requestId: requestData.id },
    });

    return request;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to delete friend request",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetFriendsList = async (userId) => {
  try {
    const acceptedRequests = await FriendRequest.findAll({
      where: {
        [Sequelize.Op.or]: [{ senderId: userId }, { receiverId: userId }],
        status: ACCEPTED,
      },
      include: [
        {
          model: User, // Assuming 'User' is the model for user details
          as: "Sender", // Alias for sender details
          attributes: ["id", "username", "email", "role", "lastLogin"], // Specify the user fields you need
          where: { id: Sequelize.col("FriendRequest.senderId") }, // Ensure this user is the sender
        },
        {
          model: User, // Alias for receiver details
          as: "Receiver",
          attributes: ["id", "username", "email", "role", "lastLogin"],
          where: { id: Sequelize.col("FriendRequest.receiverId") }, // Ensure this user is the receiver
        },
      ],
    });

    return acceptedRequests.map((request) => {
      const friend =
        request.senderId === userId ? request.Receiver : request.Sender;
      return {
        userId: friend.id,
        name: friend.username,
        email: friend.email,
        role: friend.role,
        lastLogin: friend.lastLogin,
      };
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch friends list",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetFriendStatus = async (userId, friendId) => {
  try {
    const request = await FriendRequest.findOne({
      where: {
        [Sequelize.Op.or]: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
        status: ACCEPTED,
      },
    });

    if (!request) {
      return false;
    }

    return request.status === ACCEPTED;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch friend status",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const SearchUsers = async (keyword, userId) => {
  try {
    const friendsAndPendingRequests = await FriendRequest.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId: userId }, // Users to whom the current user sent requests
          { receiverId: userId }, // Users who sent requests to the current user
        ],
        status: ["PENDING", "ACCEPTED"], // Check for pending or accepted requests
      },
      attributes: ["senderId", "receiverId"],
    });

    const excludedUserIds = friendsAndPendingRequests.map((request) =>
      request.senderId === userId ? request.receiverId : request.senderId
    );

    const users = await User.findAll({
      where: {
        [Sequelize.Op.and]: [
          {
            [Sequelize.Op.or]: [
              { username: { [Sequelize.Op.like]: `%${keyword}%` } },
              { email: { [Sequelize.Op.like]: `%${keyword}%` } },
            ],
          },
          {
            id: {
              [Sequelize.Op.notIn]: excludedUserIds, // Exclude users already friends or with pending requests
            },
          },
          {
            id: { [Sequelize.Op.not]: userId }, // Exclude the current user
          },
        ],
      },
      attributes: ["id", "username", "email", "profilePicture"],
      limit: 5,
    });

    return users.map((user) => ({
      id: user.id,
      name: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    }));
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to search users",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
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
