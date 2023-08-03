const Contact = require("./schemas/contact");

const listContacts = async () => {
  return Contact.find();
};

const getContactById = (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const addContact = ({ name, email, phone, favorite }) => {
  return Contact.create({ name, email, phone, favorite });
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const updateStatus = (id, favorite)=>{
  return Contact.findByIdAndUpdate({ _id: id }, favorite, { new: true });
}

module.exports = {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact,
    updateStatus,
};
