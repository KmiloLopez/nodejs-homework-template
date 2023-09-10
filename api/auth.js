const express = require("express");
const router = express.Router();
const signupCtrl = require("../controller/signup");
const loginCtrl = require("../controller/login");
const auth = require("../middleware/auth");
const multer = require("multer");
const currentCtrl = require("../controller/current");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const sharp = require("sharp");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const contactSchema = require("../schemas/contacts");
const userSchema = require("../schemas/user");
const { NotFound } = require("http-errors");
const { getUserByVerificationToken, verifyUser } = require("../service/user");
const { verify } = require("jsonwebtoken");

console.log(process.cwd());
const uploadDirTmp = path.join(process.cwd(), "public/tmp"); //ruta temporary folder
const AvatarsFolder = path.join(process.cwd(), "public/avatars"); //ruta y nombre de carpeta

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, uploadDirTmp); //definicion de donde se guardara el archivo de envio en solicitud
  },
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

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

router.get("/verify/:verificationToken", async (req, res, next) => {
  
  try {
    const existingUser = await getUserByVerificationToken(
      req.params.verificationToken
    );

    if (existingUser) {
      await verifyUser(existingUser._id);
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'Verification Successful, Email Verified'
      });
    } else res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Error, Not Found'
    });;
  } catch (err) {
    next(err);
  }
});
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

router.post("/upload", upload.single("picture"), async (req, res, next) => {
  const { description } = req.body;
  const { path: temporaryName, originalname } = req.file;
  const fileName = path.join(AvatarsFolder, originalname);
  try {
    await fs.rename(temporaryName, fileName);
  } catch (err) {
    await fs.unlink(temporaryName);
    return next(err);
  }
  res.json({ description, message: "File uploaded successfully", status: 200 });
});

router.patch(
  "/avatars",
  validToken,
  upload.single("avatar"),//middleware upload pic same name
  async (req, res, next) => {
    const { path: temporaryName, originalname } = req.file;

    const fileName = path.join(uploadDirTmp, originalname); //es igual a temporaryName pero este es la ruta exacta del sistema

    otraRuta = path.join(uploadDirTmp, "YouAreTheBestCami.jpg");
    newfolderCompletePath = path.join(AvatarsFolder, "YouAreTheBestCami.jpg");
    currenFolderPath = path.join(uploadDirTmp, originalname);
    try {
      fs.rename(currenFolderPath, newfolderCompletePath, (err) => {
        //mobiendo archivo a carpeta avatars
        if (err) {
          console.error("Error al mover el archivo:", err);
        } else {
          console.log("El archivo se ha movido exitosamente.");
        }
      });
      
      Jimp.read(newfolderCompletePath)
        .then((picture) => {
          return picture
            .resize(250, 250) // resize
            .write(newfolderCompletePath); // save
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      await fs.unlink(temporaryName);
      return next(err);
    }
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const secret = process.env.SECRET;

    jwt.verify(token, secret, async (error, decoded) => {
      if (error) {
        console.error("Error al verificar el token:", error);
      } else {
        // El token es válido, y 'decoded' contiene el payload
        console.log("Payload del token decodificado:", decoded);
        const id = decoded.id;
        const avatarURL =newfolderCompletePath;
        const result = await userSchema.findByIdAndUpdate(
          id,
          { avatarURL },
          { new: true }
        );
        if (!result) {
          throw new NotFound(`Product with id=${id} not found`);
        }
        res.json({
          status: "success",
          code: 200,
          data: {
            newAvatarURL: result.avatarURL,
          },
        });
      }
    });
  }
);

module.exports = router;
