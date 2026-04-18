const express = require("express");
const router = express.Router();
const {
  getTasks,
  addTask,
  deleteTask,
  updateTask,
  changeTaskCategory,
} = require("../controllers/taskController");

router.get("/", getTasks);
router.post("/", addTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);
router.put("/:id/changeCategory", changeTaskCategory);

module.exports = router;