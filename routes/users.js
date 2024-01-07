const router = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/users");

// router.use((req, res, next) => {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", createUser);

module.exports = router;
