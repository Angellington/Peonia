const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Posts = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 2000],
      },
    },
    deleteCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [4, 100],
      },
    },
    image: {
      type: DataTypes.STRING(2048),
      allowNull: true,
      validate: {
        isUrl: {
          msg: "A imagem deve ser uma URL válida",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Posts;
