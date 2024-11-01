"use strict";
const { Model } = require("sequelize");
const {
  roles,
  themePreference,
  activityTypes,
} = require("../utils/common/enums");
const { encryptPassword } = require("../utils/common/bcrypt");
const { ADMIN, USER } = roles;
const { LIGHT, DARK } = themePreference;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.hasMany(models.FriendRequest, {
      //   foreignKey: "senderId",
      // });
      // User.hasMany(models.FriendRequest, {
      //   foreignKey: "receiverId",
      // });
      // User.hasMany(models.Message, {
      //   foreignKey: "senderId",
      // });
      // User.hasMany(models.Message, {
      //   foreignKey: "receiverId",
      // });
      // User.hasMany(models.Notification, {
      //   foreignKey: "userId",
      // });
      // User.hasMany(models.Activity, {
      //   foreignKey: "userId",
      // });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      password: { type: DataTypes.STRING, allowNull: false },
      profilePicture: { type: DataTypes.STRING },
      bio: { type: DataTypes.TEXT },
      themePreference: {
        type: DataTypes.ENUM(LIGHT, DARK),
        allowNull: false,
        defaultValue: LIGHT,
      },
      role: {
        type: DataTypes.ENUM(ADMIN, USER),
        allowNull: false,
        defaultValue: USER,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },
      twoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      twoFactorSecret: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        async beforeCreate(user) {
          let hash = await encryptPassword(user.password);
          user.password = hash;
        },
      },
    }
  );
  return User;
};
