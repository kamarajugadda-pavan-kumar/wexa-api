"use strict";
const { Model } = require("sequelize");
const { friendRequestStatus } = require("../utils/common/enums");
const { PENDING, ACCEPTED, REJECTED } = friendRequestStatus;
module.exports = (sequelize, DataTypes) => {
  class FriendRequest extends Model {
    static associate(models) {
      FriendRequest.belongsTo(models.User, {
        as: "Sender",
        foreignKey: "senderId",
      });
      FriendRequest.belongsTo(models.User, {
        as: "Receiver",
        foreignKey: "receiverId",
      });
    }
  }
  FriendRequest.init(
    {
      senderId: { type: DataTypes.INTEGER, allowNull: false },
      receiverId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM(PENDING, ACCEPTED, REJECTED),
        defaultValue: PENDING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "FriendRequest",
    }
  );
  return FriendRequest;
};
