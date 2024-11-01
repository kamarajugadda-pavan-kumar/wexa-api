const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const { JWT_SECRET } = require("../config/server-config");
const { validateToken } = require("../utils/common/jwt");

const authMiddlewareSignUp = (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      throw new AppError(
        "Email, password and username are required",
        StatusCodes.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    ErrorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    res.status(error.statusCode).json(ErrorResponse);
  }
};

const authMiddlewareSignIn = (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        StatusCodes.BAD_REQUEST
      );
    }

    next();
  } catch (error) {
    ErrorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    res.status(error.statusCode).json(ErrorResponse);
  }
};

const validateJWTMiddleware = (req, res, next) => {
  try {
    // const token = req.headers["authorization"]?.split(" ")[1];
    const token = req.cookies.authToken;
    if (!token) {
      throw new AppError("JWT token missing", StatusCodes.UNAUTHORIZED);
    }

    const payload = validateToken(token);
    req.user = payload;
    next();
  } catch (error) {
    ErrorResponse.error = {
      explanation: error.explanation,
      details: error.details,
    };
    res.status(error.statusCode).json(ErrorResponse);
  }
};

module.exports = {
  authMiddlewareSignUp,
  authMiddlewareSignIn,
  validateJWTMiddleware,
};
