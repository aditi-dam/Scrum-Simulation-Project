const express = require("express");
const router = express.Router();
const { register, login, me, logout, guest } = require("../controllers/authController");
const { redirectIfAuthenticated } = require("../middleware/authMiddleware");

router.get("/login", redirectIfAuthenticated, (req, res) => {
  res.sendFile("login.html", { root: "client" });
});

router.get("/register", redirectIfAuthenticated, (req, res) => {
  res.sendFile("register.html", { root: "client" });
});

router.post("/register", register);
router.post("/login", login);
router.get("/me", me);
router.post("/logout", logout);
router.post("/guest", guest);

module.exports = router;