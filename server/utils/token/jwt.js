const jwt = require("jsonwebtoken");
const config = require("config");

const generateToken = (payload, expDate = "30d") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.get("jwt"),
      {
        expiresIn: expDate,
      },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.get("jwt"), (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    });
  });
};

module.exports = { generateToken, verifyToken };
