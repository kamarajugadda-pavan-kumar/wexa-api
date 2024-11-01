const { StatusCodes } = require("http-status-codes");
const { AuthRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { comparePassword } = require("../utils/common/bcrypt");
const { generateToken } = require("../utils/common/jwt");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../notifications");
const { EMAIL_VERIFICATION } = require("../notifications/templates");
const { verifyTOTP } = require("../utils/common/2FA");

const signUp = async (data) => {
  try {
    let verificationToken = uuidv4();
    let createdUser = await new AuthRepository().createUser({
      ...data,
      verificationToken,
    });
    console.log(createdUser, "createdUser");

    const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: createdUser.email,
      subject: "Verify your email address",
      html: EMAIL_VERIFICATION({
        username: createdUser.username,
        verificationLink,
      }),
    });

    return {
      successMessage: "user signup successful. Check your email to verify.",
      userId: createdUser.id,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to signup user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const signIn = async (data) => {
  try {
    const user = await new AuthRepository().findUserByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    if (!user.isVerified) {
      throw new AppError(
        "Please verify your email before logging in.",
        StatusCodes.UNAUTHORIZED
      );
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    if (!user.twoFactorEnabled) {
      user.update({ lastLogin: Date.now() });
      return {
        token: generateToken({
          id: user.id,
          email: user.email,
        }),
        userId: user.id,
      };
    }

    if (data.totp) {
      const isValid = verifyTOTP(user.twoFactorSecret, data.totp);
      if (!isValid) {
        throw new AppError("Invalid 2FA code", StatusCodes.UNAUTHORIZED);
      }
    } else {
      return {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        twoFactorEnabled: true,
      };
    }

    user.update({ lastLogin: Date.now() });
    return {
      token: generateToken({
        id: user.id,
        email: user.email,
      }),
      userId: user.id,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to signin user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const verifyEmail = async (token) => {
  try {
    const user = await new AuthRepository().findUserByVerificationToken(token);
    if (!user) {
      throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
    user.update({
      verificationToken: null,
      isVerified: true,
    });
    return {
      successMessage: "Email verification successful",
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to verify email",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  signUp,
  signIn,
  verifyEmail,
};
