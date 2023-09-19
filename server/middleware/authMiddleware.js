const chalk = require("chalk");
const { verifyToken } = require("../utils/token/tokenService");
const CustomError = require("../utils/CustomError");

const authMiddleware = async (req, res, next) => {
  try {
    const tokenFromClient = req.header("x-auth-token");
    if (!tokenFromClient) {
      console.log(chalk.redBright("Authorization Error: User did not sent token!"));
      throw new CustomError("Please login");
    }
    const userData = await verifyToken(tokenFromClient);
    if (!userData) {
      console.log(chalk.redBright("Authorization Error: Invalid Token!"));
      throw new CustomError("Invalid token");
    }
    req.userData = userData;
    next();
  } catch (err) {
    console.log(err)
    let errToSend;
    if (err instanceof CustomError) {
      errToSend = err;
    } else {
      errToSend = new CustomError("Invalid token");
    }
    next(errToSend);
  }
};


module.exports = authMiddleware;
