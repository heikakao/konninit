const express = require("express");
// const bodyParser = require("body-parser");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();
const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", registerUser);
router.get("/", protect, allUsers);
router.post("/login", authUser);

module.exports = router;
