const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../schemas/user");
const { getUserByEmail } = require("../service/user");
require("dotenv").config();
const secret = process.env.SECRET;

const loginCtrl = async (req, res, next) => {
   const { email, password } = req.body;
  
  const user = await getUserByEmail(email);

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    subscription: user.subscription
  };

  const token = jwt.sign(payload, secret, { expiresIn: "2h" });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
    user: {
      email: payload.email,
      subscription: payload.subscription,
    }
  });
};

module.exports = loginCtrl;
