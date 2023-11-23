const sequelize = require("../util/db");
const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const processSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "all fieds are mandatory" });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const processlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ Error: "User not Exist" });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);

    console.log("Password Matched : ", passwordMatched);

    if (!passwordMatched) {
      return res.status(401).json({ Error: "User not authorized" });
    }
    res.status(201).json({ message: " user logged in succesfully" });
  } catch (err) {
    console.log("Error during Login", err);
    res.status(500).json({ error: "Error occured while login" });
  }
};

module.exports = { processSignup, processlogin };
