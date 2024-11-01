"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, {
        as: "Sender", // Alias for sender details
        foreignKey: "senderId",
      });

      Message.belongsTo(models.User, {
        as: "Receiver", // Alias for receiver details
        foreignKey: "receiverId",
      });
    }
  }
  Message.init(
    {
      senderId: { type: DataTypes.INTEGER, allowNull: false },
      receiverId: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
      readStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
