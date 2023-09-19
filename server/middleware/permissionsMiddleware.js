const CustomError = require("../utils/CustomError");
const Joi = require('joi');


const permissionsMiddleware = (isAdmin) => {
  return (req, res, next) => {
    if (!req.userData) {
      return next(new CustomError("Must provide userData", 401));
    }

    if (isAdmin && !req.userData.isAdmin) {
      return next(new CustomError("Unauthorized: You must be an admin to access this route", 403));
    }

    next();
  };
};


module.exports = permissionsMiddleware;
