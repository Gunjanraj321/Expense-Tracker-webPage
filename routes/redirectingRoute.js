const express = require("express");
const router = express.Router();
const path = require("path");

const { processSignup , processlogin } = require('../controllers/userController')


router.get("/welcome" , (req , res )=>{
    const filePath = path.join(__dirname,"..","public","welcome","welcome.html");
    res.sendFile(filePath);
})

router.get("/login" ,(req , res )=> {
    const filePath = path.join(__dirname,"..","public","login","login.html");
    res.sendFile(filePath);
})

router.get("/signup" ,(req , res )=> {
    const filePath = path.join(__dirname,"..","public","signup","signup.html");
    res.sendFile(filePath);
})
router.get("/expenses" , (req, res) => {
    const filePath = path.join(__dirname,"..","public","expanseTracker","expanseTracker.html");
    res.sendFile(filePath);
})

router.post('/signup',processSignup);

router.post('/login',processlogin);

module.exports = router;