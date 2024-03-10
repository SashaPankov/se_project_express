const router = require("express").Router();
const { getUserById, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserId } = require("../middlewares/validation");

router.get("/me", auth, validateUserId, getUserById);
router.patch("/me", auth, validateUserId, updateProfile);

module.exports = router;
