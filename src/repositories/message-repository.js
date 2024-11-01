const CRUDRepository = require("./crud-repository");
const { Message } = require("../models");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

class MessageRepository extends CRUDRepository {
  constructor() {
    super(Message);
  }
}
module.exports = MessageRepository;
