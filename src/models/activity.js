"use strict";
const { Model } = require("sequelize");
const { activityTypes } = require("../utils/common/enums");
const {
  USER_CREATED,
  USER_LOGIN,
  USER_LOGOUT,
  FRIEND_REQUEST_CREATED,
  FRIEND_ACCEPTED,
  FRIEND_REJECTED,
  MESSAGE,
  USER_UPDATED_PROFILE,
} = activityTypes;
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Activity.belongsTo(models.User, {
        foreignKey: "relatedUserId",
      });
    }
  }
  Activity.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      activityType: {
        type: DataTypes.ENUM(
          USER_CREATED,
          USER_LOGIN,
          USER_LOGOUT,
          FRIEND_REQUEST_CREATED,
          FRIEND_ACCEPTED,
          FRIEND_REJECTED,
          MESSAGE,
          USER_UPDATED_PROFILE
        ),
        allowNull: false,
      },
      description: { type: DataTypes.TEXT, defaultValue: "" },
      relatedUserId: { type: DataTypes.INTEGER, defaultValue: null },
    },
    {
      sequelize,
      modelName: "Activity",
    }
  );
  return Activity;
};
