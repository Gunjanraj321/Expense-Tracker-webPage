require('dotenv').config();

const express = require('express');
const User = require('./models/userModel');
const sequelize = require('./util/db');
const router = require('./routes/signupRoute');

const app = express();
app.use(express.json());

const port = process.env.PORT ||3000 ;

app.use('/',router)

sequelize
    .sync()
    .then(result =>{
        app.listen(port, ()=>{
            console.log('server running on port :',port);
        })
    }).catch(err=>console.log(err))