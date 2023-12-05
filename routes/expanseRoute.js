const express = require("express");
const router = express.Router();

const {
  createExpanse,
  fetchExpanse,
  deleteExpanse,
  getExpenseById,
  downloadedExpense,
  getFileHistory,
  updateExpense,
} = require("../controllers/ExpanseController");

router.post("/", createExpanse);
router.get("/paginated", fetchExpanse);
router.get("/reportDownload", downloadedExpense);
router.get("/fileHistory", getFileHistory);
router.get("/:id", getExpenseById);
router.delete("/:id", deleteExpanse);
router.put("/:id",updateExpense);

module.exports = router;
