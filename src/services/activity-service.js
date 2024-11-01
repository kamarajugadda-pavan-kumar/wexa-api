const { StatusCodes } = require("http-status-codes");
const { Activity } = require("../models");
const AppError = require("../utils/errors/app-error");

const logUserActivity = async (
  userId,
  activityType,
  description = "",
  relatedUserId = null
) => {
  try {
    await Activity.create({
      userId,
      activityType,
      description,
      relatedUserId,
    });
    console.log("Activity logged successfully");
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to log activity",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const GetUserActivity = async (userId) => {
  try {
    const activities = await Activity.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return activities;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch user activity",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  logUserActivity,
  GetUserActivity,
};
