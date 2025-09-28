const { Sequelize } = require("sequelize");
require('dotenv').config();

const DATABASE = process.env.DB_DATABASE
const USERNAME = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const HOST = process.env.DB_HOST

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "postgres",
  logging: true,
});

const database = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco feita com sucesso!");
    
    await sequelize.sync();
    console.log("Modelos sincronizados com sucesso!");
    
  } catch (err) {
    console.error("Erro ao conectar com o banco:", err);
  }
};

module.exports = { sequelize, database };
