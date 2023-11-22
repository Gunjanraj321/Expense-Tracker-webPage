const sequelize = require("../util/db");
const User = require("../models/userModel.js");

const processSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "all fieds are mandatory" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "user already exist" });
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { processSignup };
