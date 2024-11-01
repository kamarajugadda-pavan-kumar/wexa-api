const { StatusCodes } = require("http-status-codes");
const { User } = require("../models");
const { generateSecret, getQRCodeURL } = require("../utils/common/2FA");
const AppError = require("../utils/errors/app-error");

const GetUserProfile = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      role: user.role,
      profilePicture: user.profilePicture,
      themePreference: user.themePreference,
      twoFactorEnabled: user.twoFactorEnabled,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch user profile",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const UpdateUserProfile = async (userId, updatedData) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }
    const { role, lastLogin, id, twoFactorEnabled, twoFactorSecret, ...rest } =
      updatedData;

    await user.update(rest);

    return {
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture,
      themePreference: user.themePreference,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to update user profile",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const EnableTwoFactorAuth = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    if (!user.twoFactorEnabled) {
      const secret = generateSecret();
      await user.update({
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      });
      return {
        twoFactorEnabled: true,
        qrCodeUri: getQRCodeURL(secret),
      };
    } else {
      throw new AppError(
        "Two-factor authentication already enabled",
        StatusCodes.BAD_REQUEST
      );
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to enable two-factor authentication",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const DisableTwoFactorAuth = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    if (user.twoFactorEnabled) {
      await user.update({ twoFactorSecret: null, twoFactorEnabled: false });
    }
    return { twoFactorEnabled: false };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to disable two-factor authentication",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  GetUserProfile,
  UpdateUserProfile,
  EnableTwoFactorAuth,
  DisableTwoFactorAuth,
};
