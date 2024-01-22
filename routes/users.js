const router = require("express").Router();
const { getUserById, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getUserById);
router.patch("/me", auth, updateProfile);

module.exports = router;
