const Expense = require("../models/expanseModel");
const User = require("../models/userModel");
const sequelize = require("../util/db");
const downloadedFiles = require("../models/downloadFiles");
const { promises: fsPromises } = require("fs");

const path = require("path");

const createExpanse = async (req, res) => {
  let t;
  try {
    const { name, amount, quantity } = req.body;

    const userId = req.user.userId;

    t = await sequelize.transaction();

    // Validation check
    if (!name || !amount || !quantity) {
      return res.status(400).json({ Error: "Missing required fields" });
    }

    const newExpanse = await Expense.create(
      {
        name,
        quantity,
        amount,
        userId: userId,
      },
      { transaction: t }
    );

    await User.update(
      {
        total_cost: sequelize.literal(`total_cost + ${amount}`),
      },
      {
        where: { id: userId },
        transaction: t,
      }
    );

    await t.commit();
    res.status(201).json(newExpanse);
  } catch (error) {
    if (t) {
      await t.rollback();
    }

    console.log("Error creating expense:", error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting the user." });
  }
};

const fetchExpanse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = req.query.page || 1;
    const pageSize = 5;
    const { count, rows } = await Expense.findAndCountAll({
      where: { userId: userId },
      attributes: ["id", "name", "quantity", "amount"],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    const totalPAges = Math.ceil(count / pageSize);

    res.json({
      totalItems: count,
      totalPAges: totalPAges,
      currentPages: page,
      expenses: rows,
    });
  } catch (error) {
    console.log("error occured while fethcing data", error);
    res.status(500).json({ error: " no data available or server not working" });
  }
};

const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const row = await Expense.findOne({ where: { id: expenseId } });
    if (!row) {
      return res.status(404).json({ error: "Expense Not Found" });
    }
    res.json(row);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ Error: "Internal Server Error while fetching a user." });
  }
};

const deleteExpanse = async (req, res) => {
  let t;
  const expenseId = req.params.id;
  try {
    t = await sequelize.transaction();

    const idMatchedRow = await Expense.findOne({
      where: { id: expenseId },
      attribute: ["id", "amount"],
      transaction: t,
    });
    if (!idMatchedRow) {
      await t.rollback();
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    const amountToDelete = idMatchedRow.amount;
    await User.update(
      {
        total_cost: sequelize.literal(`total_cost-${amountToDelete}`),
      },
      {
        where: { id: req.user.userId },
        transaction: t,
      }
    );
    await Expense.destroy({
      where: { id: expenseId },
      transaction: t,
    });
    await t.commit();

    res.json({
      message: "Expanse deleted Successfully",
    });
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    console.log("error deleting expense:", error);
    res
      .status(500)
      .json({ Error: "An error occurred while deleting the user." });
  }
};

const updateExpense = async (req, res) => {
  let t;
  const expenseId = req.params.id;
  const { name, amount, quantity } = req.body;
  const user = req.user;
  try {
    const userId = req.user.userId;
    t = await sequelize.transaction();
    
    const rowUpdated = await Expense.update(
      { name, quantity, amount },
      { where: { id: expenseId,userId: userId }, returning: true, transaction: t }
    );
    
    const updatedExpanse = await Expense.findByPk(expenseId);

    if (rowUpdated === 0) {
      await t.rollback();
      return res.status(404).json("Error: Expsnse not found")
    }

    const diffAmount = amount - updatedExpanse.amount;

    await User.update(
      { total_cost: sequelize.literal(`total_cost + ${diffAmount}`) },
      { where: { id: userId }, transaction: t }
    );
    await t.commit();

    res.json(updatedExpanse);
  } catch (error) {
    if (t) {
      await t.rollback();
    }
    console.error("error updating expense:", error);
    res.status(500).json({
      error: "An error occurred while updating the user.",
    });
  }
};

const downloadedExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenses = await Expense.findAll({ where: { userId: userId } });

    // Convert expenses to JSON string
    const stringifiedExpenses = JSON.stringify(expenses);

    const downloadsDir = path.join(__dirname, "..", "downloads");

    // Create 'downloads' directory if it doesn't exist
    if (
      !(await fsPromises
        .access(downloadsDir, fsPromises.constants.F_OK)
        .then(() => true)
        .catch(() => false))
    ) {
      await fsPromises.mkdir(downloadsDir);
    }

    // Create a unique filename based on the current timestamp
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/:/g, "-");
    const filename = `Expenses_${userId}_${formattedDate}.txt`;

    // Define the file path
    const filePath = path.join(downloadsDir, filename);

    // Write the expenses to a file
    await fsPromises.writeFile(filePath, stringifiedExpenses);

    // Send the file as a response
    res.download(filePath, filename, (err) => {
      // Clean up: Delete the file after sending
      fsPromises.unlink(filePath).catch((unlinkErr) => {
        console.error("Error deleting file:", unlinkErr);
      });

      if (err) {
        console.error("Error downloading file:", err);
      }
    });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({
      message: "Something went wrong on the backend",
      error: e.message || e,
    });
  }
};

const getFileHistory = async (req, res) => {
  try {
    let userId = req.user.userId;
    let files = await downloadedFiles.findAll({ where: { userId: userId } });
    console.log(files);
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "can't find the require files", err: err });
  }
};

module.exports = {
  createExpanse,
  fetchExpanse,
  deleteExpanse,
  getExpenseById,
  updateExpense,
  getFileHistory,
  downloadedExpense,
};
