const service = require("../service");

const get = async (req, res, next) => {
  try {
    const results = await service.listContacts();

    res.json({
      status: "success01",
      code: 200,
      data: {
        contacts: results,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  let result = "";
  try {
    console.log("aca entro al TRYcon id: ", contactId);
    if (contactId.match(/^[0-9a-fA-F]{24}$/)) {
      // Yes, it's a valid ObjectId, proceed with `getContactById` call.
      result = await service.getContactById(contactId);
    }
    console.log("result is ", result);
    if (!result) {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact not found by id ${contactId}`,
        data: "Not found",
      });
    }
    res.json({
      status: "success",
      code: 200,
      data: {
        data: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await service.addContact({ name, email, phone, favorite });

    res.status(201).json({
      status: "success",
      code: 201,
      data: { contact: result },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;

  try {
    const result = await service.updateContact(contactId, {
      name,
      email,
      phone,
      favorite,
    });
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact not found by id ${contactId}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const result = await service.removeContact(contactId);
    if (result) {
      res.json({
        status: "success",
        code: 200,
        data: { contact: result },
      });
    } else {
      res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact not found by id ${contactId}`,
        data: "Not found",
      });
    }
  } catch (error) {
    console.error(error);
    next();
  }
};
const status = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  console.log("FAVORITE", favorite);
  if (favorite !== undefined) {
    try {
      if (contactId.match(/^[0-9a-fA-F]{24}$/)) {
        const result = await service.updateContact(contactId, { favorite });
        console.log("este es el result", result);
        if (result) {
          res.json({
            status: "success",
            code: 200,
            data: { contact: result },
          });
        } else {
          res.status(404).json({
            status: "error",
            code: 404,
            message: `Not found id: ${contactId}`,
            data: "Not found",
          });
        }
      }else{
        res.status(404).json({
        status: "error",
        code: 404,
        message: `Contact not found by id ${contactId}`,
        data: "Not found",
      });
      }
    } catch (error) {
      console.error(error);
      next();
    }
  } else {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `missing field favorite`,
      data: "Not found",
    });
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
  status,
};
