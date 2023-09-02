const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
          type: String,
          required: [true, "Username required"],
          unique: true,
        },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      
      type: String,
      
    },
  }
  
);

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", userSchema);
//user is the name of the collection (singular) in which users are stored.

module.exports = User;
