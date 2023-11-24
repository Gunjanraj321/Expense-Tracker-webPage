const Expanse = require("../models/expanseModel");
const sequelize = require("../util/db");

const createExpanse = async (req, res) => {
  try {
    const { name, amount, quantity } = req.body;
    console.log(req.body);
    // Validation
    if (!name || !amount || !quantity) {
      return res.status(400).json({ Error: 'Missing required fields' });
    }

    const newExpanse = await Expanse.create({
      name,
      quantity,
      amount,
    });
    res.status(201).json(newExpanse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchExpanse = async (req, res) => {
  try {
    const data = await Expanse.findAll();
    res.json(data);
  } catch (error) {
    console.log("error occured while fethcing data", error);
    res.status(500).json({ error: " no data available or server not working" });
  }
};

const deleteExpanse = async (req, res) => {
  const id = req.params.id;
  try {
    const idMAtched = await Expanse.findOne({ where: { id } });
    if (idMAtched) {
      const result =await Expanse.destroy({ where: { id } });
      if (result) {
        res.json({ message: "expanse deleted successfully" });
      }else{
        res.status(400).json({message:"failed to delete expanse"});
      }
    } else {
      res.status(400).json({ message: "wrong id" });
    }
  } catch (error) {
    console.log("some error occured", error);
    res.status(500).json({ message: "some error occured " });
  }
};

module.exports = { createExpanse, fetchExpanse, deleteExpanse };
