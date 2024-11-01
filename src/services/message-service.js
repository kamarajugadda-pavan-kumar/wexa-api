const { StatusCodes } = require("http-status-codes");
const { MesssageRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Sequelize, Message, User } = require("../models");
const { GetFriendStatus } = require("./friend-request-service");

const CreateMessage = async (data) => {
  try {
    const { senderId, receiverId, message: content } = data;
    const isFriend = await GetFriendStatus(senderId, receiverId);
    if (!isFriend) {
      throw new AppError(
        "You are not friends with this user",
        StatusCodes.FORBIDDEN
      );
    }

    const createdMessage = await new MesssageRepository().createResource({
      senderId,
      receiverId,
      content,
    });

    return createdMessage;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to create message",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetMessagesBetweenUsers = async (senderId, receiverId) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    return messages;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to fetch messages between users",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetAllConversations = async (userId) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [Sequelize.Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      attributes: [
        [
          Sequelize.fn("MAX", Sequelize.col("Message.createdAt")),
          "latestMessageTime",
        ],
        "senderId",
        "receiverId",
        [
          Sequelize.literal(`(
            SELECT content FROM Messages AS m 
            WHERE 
              (m.senderId = Message.senderId AND m.receiverId = Message.receiverId OR 
               m.senderId = Message.receiverId AND m.receiverId = Message.senderId)
            ORDER BY createdAt DESC
            LIMIT 1
          )`),
          "lastMessageContent",
        ],
        // Subquery to get the number of unread messages
        [
          Sequelize.literal(`(
            SELECT COUNT(*) FROM Messages AS m 
            WHERE 
              (m.senderId = Message.senderId AND m.receiverId = Message.receiverId OR 
               m.senderId = Message.receiverId AND m.receiverId = Message.senderId)
              AND m.readStatus = false
          )`),
          "unreadCount",
        ],
      ],
      include: [
        {
          model: User,
          as: "Sender", // logged in user
          attributes: ["id", "username", "email"],
          where: { id: Sequelize.col("Message.senderId") },
        },
        {
          model: User,
          as: "Receiver", // other users
          attributes: ["id", "username", "email"],
          where: { id: Sequelize.col("Message.receiverId") },
        },
      ],
      group: ["senderId", "receiverId"],
      order: [["latestMessageTime", "DESC"]],
    });

    return conversations;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to fetch conversations",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const MarkMessagesAsRead = async (receiverId, senderId) => {
  try {
    await Message.update(
      { readStatus: true },
      { where: { receiverId, senderId, readStatus: false } }
    );
    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to mark messages as read",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const DeleteMessage = async (senderId, messageId) => {
  try {
    const message = await Message.findByPk(messageId);
    if (!message) {
      throw new AppError("Message not found", StatusCodes.NOT_FOUND);
    }

    if (message.senderId !== senderId) {
      throw new AppError(
        "You are not authorized to delete this message",
        StatusCodes.FORBIDDEN
      );
    }

    await message.destroy();
    return true;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Unable to delete message",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  CreateMessage,
  GetMessagesBetweenUsers,
  GetAllConversations,
  MarkMessagesAsRead,
  DeleteMessage,
};
