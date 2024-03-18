const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const HTTPConflictError = require("../utils/httpconflicterror");
const HTTPBadRequest = require("../utils/httpbadrequest");

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Errors.HTTPNotFound(`User with id ${req.user._id} not found`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new HTTPBadRequest(`Invalid User Id: ${req.user._id}.`));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, avatar, email, password: hash }).then((user) =>
        res.send({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        }),
      ),
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new HTTPBadRequest(Errors.defaultBadRequestMessage));
      } else if (
        err.name === "MongoServerError" &&
        err.code === Errors.MONGODB_DUPLICATE_ERROR
      ) {
        next(new HTTPConflictError(`e-mail ${email} is alredy exists.`));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new HTTPBadRequest(Errors.defaultBadRequestMessage));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findOneAndUpdate(
    { id: req.user._id },
    { name, avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Errors.HTTPNotFound(`User with id ${req.user._id} not found`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new HTTPBadRequest(Errors.defaultBadRequestMessage));
      } else {
        next(err);
      }
    });
};
