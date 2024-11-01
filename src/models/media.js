"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {
      Media.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post",
      });
    }
  }

  Media.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      mediaType: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false,
      },
      mediaUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Media",
    }
  );

  return Media;
};
