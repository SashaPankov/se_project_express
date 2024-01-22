const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const HTTPUnauthorized = require("../utils/httpunauthorized");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Wrong email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  if (!email || !password) {
    const errNoLogin = new Error("Password or email not defined");
    errNoLogin.name = "validateError";
    return Promise.reject(errNoLogin);
  }

  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new HTTPUnauthorized("Incorrect email or password"),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new HTTPUnauthorized("Incorrect email or password"),
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
