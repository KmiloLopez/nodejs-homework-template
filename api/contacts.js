const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createContact, getAllContacts } = require("../service/contact");
const contactSchema = require("../schemas/contacts");

const { NotFound } = require("http-errors");

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


router.post("/", validToken, auth, async (req, res, next) => {
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

router.get("/", validToken, auth, async (req, res, next) => {
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
router.get("/:id", validToken, auth, async (req, res, next)=> {
  
  const { id } = req.params;
 
  try {
    

    const result = await contactSchema.findById(id); 
    if (!result) {
        throw new NotFound(`Product with id=${id} not found`);
    }
    res.json({
        status: "success",
        code: 200,
        data: {
            result
        }
    })
  } catch (error) {
    next(error);
  }

});

router.put("/:id", validToken, auth, async (req, res, next)=>{
  const { id } = req.params;
  const result = await contactSchema.findByIdAndUpdate(id, req.body, {new: true});
  if (!result) {
      throw new NotFound(`Product with id=${id} not found`);
  }
  res.json({
      status: "success",
      code: 200,
      data: {
          result
      }
  })
});

router.patch("/:id/favorite", validToken, auth, async (req, res, next)=>{
  const { id } = req.params;
  const {favorite} = req.body;
  const result = await contactSchema.findByIdAndUpdate(id, {favorite}, {new: true});
  if (!result) {
      throw new NotFound(`Product with id=${id} not found`);
  }
  res.json({
      status: "success",
      code: 200,
      data: {
          result
      }
  })
});
router.delete("/:id", validToken, auth, async (req, res, next)=>{
  const { id } = req.params;
  const result = await contactSchema.findByIdAndRemove(id);
  if (!result) {
      throw new NotFound(`Product with id=${id} not found`);
  }
  res.json({
      status: "success",
      code: 200,
      message: "product deleted",
      data: {
          result
      }
  })
});



module.exports = router;
