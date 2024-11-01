require("dotenv").config(); // To load environment variables from a .env file if you're using dotenv

module.exports = {
  development: {
    username: process.env.DB_UN,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  },
  test: {
    username: process.env.DB_UN,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  },
  production: {
    username: process.env.DB_UN,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  },
};
