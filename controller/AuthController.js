const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { use } = require("../app");
const register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hashedPassword) {
    if (err) {
      res.json({
        error: err,
      });
    }
  });
  let user = new User({
    email: req.body.email,
    password: req.body.hashedPassword,
  });
  user
    .save()
    .then((user) => {
      message: "User Added Successful";
    })
    .catch((error) => {
      res.json({
        error: "error in registration",
      });
    });
};
module.exports = register;
