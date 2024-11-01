const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
class CRUDRepository {
  constructor(modal) {
    this.modal = modal;
  }
  async createResource(data) {
    try {
      const createdResource = await this.modal.create(data);
      return createdResource;
    } catch (error) {
      if (
        error.name == "SequelizeValidationError" ||
        error.name == "SequelizeUniqueConstraintError"
      ) {
        let details = error.errors.map((_) => _.message);
        throw new AppError(
          "Validation Error",
          StatusCodes.BAD_REQUEST,
          null,
          details
        );
      } else if (error.name == "SequelizeForeignKeyConstraintError") {
        throw error;
      }
      throw new AppError("RepositoryError", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getResource(id) {
    try {
      const resource = await this.modal.findByPk(id);
      if (!resource) {
        throw new AppError("Resource Not Found", StatusCodes.NOT_FOUND);
      }
      return resource;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Something went wrong",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateResource(data) {
    try {
      const updatedResource = await this.modal.update(data, {
        where: { id: data.id },
        returning: true,
      });
      if (updatedResource[0] == 0) {
        throw new AppError("Resource Not Found", StatusCodes.NOT_FOUND);
      }
      return this.getResource(data.id);
    } catch (error) {
      throw new AppError("RepositoryError", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteResource(id) {
    try {
      const deletedResource = await this.modal.destroy({ where: { id } });
      if (deletedResource == 0) {
        throw new AppError("Resource Not Found", StatusCodes.NOT_FOUND);
      }
      return deletedResource;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("RepositoryError", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getResources(customFilter, sortOptions) {
    try {
      const resources = await this.modal.findAll({
        where: customFilter,
        order: sortOptions,
      });
      return resources;
    } catch (error) {
      console.log(error);
      throw new AppError("RepositoryError", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = CRUDRepository;
