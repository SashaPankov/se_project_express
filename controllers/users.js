const User = require("../models/user");
const Errors = require("../utils/errors");

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
      return Errors.defaultError(res, err);
    });
};

module.exports.getUserById = (req, res) => {
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
      return Errors.defaultError(res, err);
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err.name === "ValidationError") {
        return Errors.validateError(res, err);
      }
      return Errors.defaultError(res, err);
    });
};
