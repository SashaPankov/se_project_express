const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Errors = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Errors.HTTPNotFound("No users yet here :(");
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err instanceof Errors.HTTPNotFound) {
        return Errors.notFoundError(res, err);
      }
      return Errors.defaultError(res);
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new Errors.HTTPNotFound(`User with id ${userId} not found`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err instanceof Errors.HTTPNotFound) {
        return Errors.notFoundError(res, err);
      }
      if (err.name === "CastError") {
        return Errors.invalidIdError(res, "User", userId);
      }
      return Errors.defaultError(res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  console.log(req.body);
  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) =>
        res.send({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        }),
      )
      .catch((err) => {
        console.error(
          "Error Name = %s Message=%s Code=%d",
          err.name,
          err.message,
          err.code,
        );
        if (err.name === "ValidationError") {
          return Errors.validateError(res);
        }
        if (
          err.name === "MongoServerError" &&
          err.code === Errors.MONGODB_DUPLICATE_ERROR
        ) {
          return Errors.dbDuplicateEmailError(res, email);
        }
        return Errors.defaultError(res);
      }),
  );
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err.name === "HTTPUnauthorized") {
        return Errors.unauthorizedError(res, err);
      }

      return Errors.validateError(res);
    });
};

module.exports.getCurrentUser = (req, res) => {
  req.params.userId = req.user._id;
  return getUserById(req, res);
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  console.log(req.user._id);

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
      console.error(
        "Error Name = %s Message=%s Code=%d",
        err.name,
        err.message,
        err.code,
      );
      if (err instanceof Errors.HTTPNotFound) {
        return Errors.notFoundError(res, err);
      }
      if (err.name === "ValidationError") {
        return Errors.validateError(res);
      }

      return Errors.defaultError(res);
    });
};
