const Contact = require("../schemas/contacts");

const getAllContacts = async ({ owner }) => {
  return Contact.find({ owner });
};

const createContact = ({ name, phone, favorite, owner }) => {
  return Contact.create({ name, phone, favorite, owner });
};

module.exports = {
  getAllContacts,
  createContact,
};
