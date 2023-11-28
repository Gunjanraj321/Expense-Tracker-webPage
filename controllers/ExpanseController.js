const Expanse = require("../models/expanseModel");
const User = require("../models/userModel");
const sequelize = require("../util/db");

const createExpanse = async (req, res) => {
  let t;
  try {
    const { name, amount, quantity } = req.body;
    const user = req.user;
    console.log(`user------------++ ${user}`);
    const userId = req.user.userId;
    console.log(userId)

    t = await sequelize.transaction();

    console.log("Received data: ", req.body);
    // Validation
    // if (!name || !amount || !quantity) {
    //   return res.status(400).json({ Error: "Missing required fields" });
    // }

    const newExpanse = await Expanse.create(
      {
        name,
        quantity,
        amount,
        userId:userId,
      },
      { transaction: t }
    );

    await User.update(
      {
        total_cost: sequelize.literal(`total_cost + ${amount}`),
      },
      {
        where: { id: user.userId },
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
    const data = await Expanse.findAll({ where: { userId: userId } });
    res.json(data);
  } catch (error) {
    console.log("error occured while fethcing data", error);
    res.status(500).json({ error: " no data available or server not working" });
  }
};

const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;
  try {
    const row = await Expanse.findOne({ where: { id: expenseId } });
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

    const idMatched = await Expanse.findOne({
      where: { id: expenseId },
      attribute: ["id", "amount"],
      transaction: t,
    });
    if (!idMatched) {
      await t.rollback();
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    const amountToDelete = idMatched.amount;
    await User.update(
      {
        total_cost: sequelize.literal(`total_cost-${amountToDelete}`),
      },
      {
        where: { id: req.user.userId },
        transaction: t,
      }
    );
    await Expanse.destroy({
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
  const expanseId = req.params.id;
  const { name, amount, quantity } = req.body;
  const user = req.user;

  try {
    const userId = req.user.userId;
    t = await sequelize.transaction();

    const row = await Expanse.update(
      {
        name,
        quantity,
        amount,
      },
      {
        where: { id: expanseId, userId: userId },
        returning: true,
        transaction: t,
      }
    );
    const updatedExpanse = await Expanse.findOne({ where: { id: expanseId } });

    if (row === 0) {
      await t.rollback();
      return res.status(404).json({
        Error: "Expense not Found",
      });
    }

    const diffAmount = amount - updatedExpanse.amount;

    await user.update(
      {
        total_cost: sequelize.literal(`total_cost + ${diffAmount}`),
      },
      {
        where: { id: userId },
        transaction: t,
      }
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

module.exports = {
  createExpanse,
  fetchExpanse,
  deleteExpanse,
  getExpenseById,
  updateExpense,
};
