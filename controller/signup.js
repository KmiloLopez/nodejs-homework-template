const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../schemas/user");
const { getUserByEmail } = require("../service/user");
require("dotenv").config();


const secret = process.env.SECRET;

const signupCtrl = async (req, res, next) => {
  console.log("req.body",req.body)
  try {
  const result = await User.validate(req.body)
  console.log("SQUMENA",result);
  } catch (error) {console.log(error)
  }
  const { username, email, password, subscription } = req.body;
  const user = await getUserByEmail(email);

  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Error Conflict",
    });
  }
  try {
    const newUser = new User({ username, email });
    newUser.setPassword(password);
    await newUser.save();

    res.status(201).json({
      status: "success",
      code: 201,
      user: {
        email: `${email}`,
        subscription: "starter"||`${subscription}`
      },
      data: {
        message: "Registration successful",
      },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = signupCtrl;
