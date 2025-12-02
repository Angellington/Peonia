const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Posts = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O título é obrigatório" },
        len: {
          args: [3, 255],
          msg: "O título deve conter mais de 3 caracteres",
        },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "A mensagem é obrigatória" },
        len: {
          args: [5, 2000],
          msg: "A mensagem deve ter entre 5 e 2000 caracteres",
        },
      },
    },
    deleteCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O código de exclusão é obrigatório" },
        len: {
          args: [4, 100],
          msg: "O código de exclusão deve ter entre 4 e 100 caracteres",
        },
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
