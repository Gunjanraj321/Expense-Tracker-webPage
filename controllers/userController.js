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

const processlogin =async (req,res) =>{
  const { email , password } = req.body;

  try{
    // Ensure that the database connection is established before querying
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const user = await User.findOne({ where : { email }});
    if(!user) {
      return res.status(400).json({Error:"User not found"})
    }
  }catch(err){
    console.log(err);
  }
}

module.exports = { processSignup , processlogin };
