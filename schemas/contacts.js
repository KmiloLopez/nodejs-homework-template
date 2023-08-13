const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, "Name is required"],
  },
  phone: {
    type: Number,
    required: [true, "Phone is required"],
  },
  favorite: {
    type: Boolean,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Contact = mongoose.model("contact", contact);
////contact is the name of the collection (singular) in which contacts are stored.
module.exports = Contact;
