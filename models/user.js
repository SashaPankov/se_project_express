const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { HTTP_UNAUTHORIZED } = require("../utils/errors");

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
    minlength: 8,
  },
});

class HTTPUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.name = "HTTPUnauthorized";
    this.statusCode = HTTP_UNAUTHORIZED;
  }
}

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  if (!email || !password) {
    return Promise.reject(new Error("Password or email not defined"));
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
