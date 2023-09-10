const express = require("express");//libreria para el servidor
const cors = require("cors"); //libreria seguridad
const connection = require("./db/connection");
require("dotenv").config();

const path = require("path");
const fs = require("fs").promises;
const routerApi = require("./api/auth");
const routerApiContacts = require("./api/contacts");
const uploadFolder = path.join(process.cwd(), "public");
const uploadDir = path.join(process.cwd(), "public/avatars");//ruta y nombre de carpeta a crear
const storeImage = path.join(process.cwd(), "public/tmp");//temporal




const app = express();

app.use(express.json());
app.use(cors());

require("./config/config-passport");

app.use("/users", routerApi);
app.use("/users/contacts", routerApiContacts);

app.use(express.static("public"));

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: `Use api on routes: 
    /api/signup - registration user {username, email, password}
    /api/login - login {email, password}
    /api/list - get message if user is authenticated`,
    data: "Not found",
  });
});

app.use((err, _, res) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});


const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIfNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};
const PORT = process.env.PORT || 3000;

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
      createFolderIfNotExist(uploadFolder);
      createFolderIfNotExist(uploadDir);
      createFolderIfNotExist(storeImage);
    });
  })
  .catch((err) => {
    console.log(`Server not running.
        Error message: ${err.message}`);
  });
