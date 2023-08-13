const express = require("express");
const router = express.Router();
const signupCtrl = require("../controller/signup");
const loginCtrl = require("../controller/login");
const auth = require("../middleware/auth");
const { createContact, getAllContacts } = require("../service/contact");
const currentCtrl = require("../controller/current");

const invalidatedTokens = new Set();

const validToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (invalidatedTokens.has(token)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
      data: "Unathorized",
    });
  }

  next();
};

router.post("/signup", signupCtrl);

router.post("/login", loginCtrl);

router.get("/current", validToken, auth, currentCtrl);

router.post("/logout", validToken, auth, (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  invalidatedTokens.add(token);
  console.log(Array.from(invalidatedTokens));

  res.status(204).json({
    status: "success",
    code: 204,
    message: "Successfully logout",
    data: "success",
  });
});

router.post("/contacts", validToken, auth, async (req, res, next) => {
  const { name, phone, favorite } = req.body;
  const owner = req.user._id;

  try {
    const result = await createContact({ name, phone, favorite, owner });

    res.status(201).json({
      status: "created",
      status: 201,
      data: { cat: result },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/contacts", validToken, auth, async (req, res, next) => {
  const owner = req.user._id;

  try {
    const results = await getAllContacts({ owner });

    res.json({
      status: "success",
      code: 200,
      data: {
        cats: results,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
