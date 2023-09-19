const config = require("config");
const mongoose = require("mongoose");
const chalk = require("chalk");

const dbUrl = config.get("dbConfig.url");
console.log(chalk.yellowBright.bold(dbUrl));
console.log(chalk.yellowBright.bold(`Connecting to ${dbUrl}`));

const connectToDB = () => {
  return mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(chalk.magentaBright.bold("Connected to MongoDB Atlas!")))
    .catch((error) =>
      console.log(chalk.redBright.bold(`Could not connect to MongoDB Atlas: ${error}`))
    );
};

module.exports = connectToDB;
