const CRUDRepository = require("./crud-repository");
const { FriendRequest } = require("../models");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

class FriendRequestRepository extends CRUDRepository {
  constructor() {
    super(FriendRequest);
  }

  async createRequest(data) {
    try {
      const createdRequest = await super.createResource(data);
      return createdRequest;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error.name == "SequelizeForeignKeyConstraintError") {
        throw new AppError("Reciever does not exists", StatusCodes.BAD_REQUEST);
      }
      throw new AppError("RepositoryError", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
module.exports = FriendRequestRepository;
