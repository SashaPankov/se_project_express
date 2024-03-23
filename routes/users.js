const router = require("express").Router();
const { getUserById, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", auth, getUserById);
router.patch("/me", auth, validateUserUpdate, updateProfile);

module.exports = router;
