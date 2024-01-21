const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const Errors = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

router.use("/items", clothingItem);
router.use("/users", user);
router.use("/signin", login);
router.use("/signup", createUser);

router.use((req, res) => {
  res
    .status(Errors.HTTP_NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
