const express = require("express");
const router = express.Router();

const {
  createExpanse,
  fetchExpanse,
  deleteExpanse,
  getExpenseById,
  downloadedExpense,
  getFileHistory,
} = require("../controllers/ExpanseController");

router.get("/", fetchExpanse);
router.post("/", createExpanse);
router.delete("/:id", deleteExpanse);
router.get("./:id", getExpenseById);
router.get("/download", downloadedExpense);
router.get("/fileHistory", getFileHistory);

module.exports = router;
