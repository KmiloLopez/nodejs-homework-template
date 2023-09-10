const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../schemas/user");
const emailService = require("../service/emailservice");
const { getUserByEmail } = require("../service/user");
require("dotenv").config();
const { nanoid } = require("nanoid");
var gravatar = require('gravatar');



const secret = process.env.SECRET;

const signupCtrl = async (req, res, next) => {
  // console.log("req.body",req.body)
  // try {
  // const result = await User.validate(req.body)
  // console.log("SQUMENA",result);
  // } catch (error) {console.log(error)
  // }
  const { username, email, password, subscription } = req.body;
  const user = await getUserByEmail(email);
  let avatarURL = gravatar.url(`${email}`, {s: '200', r: 'pg', d: 'robohash'});
  
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Error Conflict",
    });
  }
  try {
    const verificationToken = nanoid();
    const newUser = new User({ username, email, avatarURL, verificationToken });
    newUser.setPassword(password);
    await newUser.save();//save the new user on DB


    emailService.sendEmail(verificationToken);
    
    res.status(201).json({
      status: "success",
      code: 201,
      user: {
        email: `${email}`,
        subscription: "starter"||`${subscription}`,
        avatarURL: `${avatarURL}`,
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
