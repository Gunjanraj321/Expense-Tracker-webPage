const User = require("../models/userModel");
const Expanse = require("../models/expanseModel");
const sequelize = require ("../util/db");

const getUserLeaderBoard = async (req, res )=>{
    try{
        const users = await User.findAll({
            attributes:["id","name","total_cost"],
            order:[["total_cost","DESC"]],
        })
        res.json(users);
    }catch(error){
        console.log(error);
        res.status(500).json({error : "Iternal Server Error"})
    }
} 

module.exports = getUserLeaderBoard;