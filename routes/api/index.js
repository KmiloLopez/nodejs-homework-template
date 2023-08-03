const express = require('express')
const router = express.Router()
const ctrlContact = require("../../controller");


router.get("/", ctrlContact.get);

router.get("/:contactId", ctrlContact.getById);

router.post("/", ctrlContact.create);

router.put("/:contactId", ctrlContact.update);

router.delete("/:contactId", ctrlContact.remove);

router.patch("/:contactId/favorite", ctrlContact.status)


module.exports = router
