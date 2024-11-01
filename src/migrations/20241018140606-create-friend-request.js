"use strict";

const { friendRequestStatus } = require("../utils/common/enums");
const { PENDING, ACCEPTED, REJECTED } = friendRequestStatus;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FriendRequests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      receiverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM(PENDING, ACCEPTED, REJECTED),
        defaultValue: PENDING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint("FriendRequests", {
      fields: ["senderId", "receiverId"],
      type: "unique",
      name: "unique_sender_receiver_constraint", // Name for the unique constraint
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FriendRequests");
  },
};
