const clothingItem = require("../models/clothingItem");
const Errors = require("../utils/errors");
const HTTPForbidden = require("../utils/httpforbidden");
const HTTPBadRequest = require("../utils/httpbadrequest");
const HTTPNotFound = require("../utils/httpnotfound");

module.exports.getClothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

module.exports.createClothingItem = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        next(new HTTPBadRequest(Errors.defaultBadRequestMessage));
      } else {
        next(err);
      }
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail(() => {
      throw new HTTPNotFound(`Item with id ${itemId} not found`);
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
      if (err.name === "CastError") {
        next(new HTTPBadRequest(`Invalid Item Id: ${itemId}.`));
      } else {
        next(err);
      }
    });
};

module.exports.likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const ownerId = req.user._id;
  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: ownerId } }, { new: true })
    .orFail(() => {
      throw new HTTPNotFound(`Item with id ${itemId} not found`);
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new HTTPBadRequest(`Invalid Item Id: ${itemId}.`));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const ownerId = req.user._id;
  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: ownerId } }, { new: true })
    .orFail(() => {
      throw new HTTPNotFound(`Item with id ${itemId} not found`);
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new HTTPBadRequest(`Invalid Item Id: ${itemId}.`));
      } else {
        next(err);
      }
    });
};
