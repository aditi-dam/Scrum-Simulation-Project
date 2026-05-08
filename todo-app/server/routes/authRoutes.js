const express = require("express");
const router = express.Router();
const { register, login, me, logout, guest, getBgColor, updateBgColor } = require("../controllers/authController");
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
router.get("/getBgColor", getBgColor);
router.post("/updateBgColor", updateBgColor);

module.exports = router;