const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postgres", "postgres", "2005", {
  host: "localhost",
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
