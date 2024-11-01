// write functions to generate JWT
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION } = require("../../config/server-config");
const AppError = require("../errors/app-error");
const { StatusCodes } = require("http-status-codes");

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

// write functions to validate JWT
const validateToken = (token) => {
  try {
    if (!token)
      throw new AppError("JWT token missing", StatusCodes.BAD_REQUEST);
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("JWT token expired", StatusCodes.UNAUTHORIZED);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid JWT token", StatusCodes.UNAUTHORIZED);
    }

    throw new AppError("Token validation failed", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = {
  generateToken,
  validateToken,
};
