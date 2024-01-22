const clothingItem = require("../models/clothingItem");
const Errors = require("../utils/errors");
const HTTPForbidden = require("../utils/httpforbidden");

module.exports.getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err instanceof Errors.HTTPNotFound) {
        return Errors.notFoundError(res, err);
      }
      return Errors.defaultError(res);
    });
};

module.exports.createClothingItem = (req, res) => {
  const ownerId = req.user._id;
  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({
      name,
      weather,
      imageUrl,
      owner: ownerId,
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err.name === "ValidationError") {
        return Errors.validateError(res);
      }
      return Errors.defaultError(res);
    });
};

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail(() => {
      throw new Errors.HTTPNotFound(`Item with id ${itemId} not found`);
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new HTTPForbidden(
          `Deleting an item of another user is not allowed`,
        );
      }

      clothingItem.deleteOne({ _id: itemId }).then((deleted) => {
        res.send({ data: deleted });
      });
    })
    .catch((err) => {
      if (err instanceof Errors.HTTPNotFound) {
        return Errors.notFoundError(res, err);
      }
      if (err instanceof HTTPForbidden) {
        return Errors.forbiddenError(res, err);
      }
      if (err.name === "CastError") {
        return Errors.invalidIdError(res, "Item", itemId);
      }
      return Errors.defaultError(res);
    });
};

module.exports.likeClothingItem = (req, res) => {
  const { itemId } = req.params;
  const ownerId = req.user._id;
  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: ownerId } }, { new: true })
    .orFail(() => {
      throw new Errors.HTTPNotFound(`Item with id ${itemId} not found`);
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err instanceof Errors.HTTPNotFound) {
        return Errors.notFoundError(res, err);
      }
      if (err.name === "CastError") {
        return Errors.invalidIdError(res, "Item", itemId);
      }
      return Errors.defaultError(res);
    });
};

module.exports.dislikeClothingItem = (req, res) => {
  const { itemId } = req.params;
  const ownerId = req.user._id;
  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: ownerId } }, { new: true })
    .orFail(() => {
      throw new Errors.HTTPNotFound(`Item with id ${itemId} not found`);
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error("Error Name = %s Message=%s", err.name, err.message);
      if (err instanceof Errors.HTTPNotFound) {
        return Errors.notFoundError(res, err);
      }
      if (err.name === "CastError") {
        return Errors.invalidIdError(res, "Item", itemId);
      }
      return Errors.defaultError(res);
    });
};
