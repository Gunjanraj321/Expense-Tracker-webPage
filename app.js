require('dotenv').config();

const express = require('express');
const path = require('path');
const User = require('./models/userModel');
const sequelize = require('./util/db');
const router = require('./routes/signupLoginPage');

const app = express();
app.use(express.json());

const port = process.env.PORT ||3000 ;
app.use(express.static(path.join(__dirname,"public")));


app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.use('/',router)

sequelize
    .sync()
    .then(result =>{
        app.listen(port, ()=>{
            console.log('server running on port :',port);
        })
    }).catch(err=>console.log(err))