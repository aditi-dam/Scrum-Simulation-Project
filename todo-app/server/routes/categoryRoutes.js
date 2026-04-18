const express = require("express");
const router = express.Router();
const {
  getCategories,
  makeCategory,
  deleteCategory,
  // updateCategory,
} = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", makeCategory);
router.delete("/:id", deleteCategory);
// router.put("/:id", updateCategory);

module.exports = router;