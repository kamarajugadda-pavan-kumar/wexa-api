"use strict";

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
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Activities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },
      activityType: {
        type: Sequelize.ENUM(
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
      description: {
        type: Sequelize.TEXT,
        defaultValue: "",
      },
      relatedUserId: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Activities");
  },
};
