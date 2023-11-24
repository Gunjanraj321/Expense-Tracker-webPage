require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/db');
const expanseRouter = require('./routes/expanseRoute');
const redirectingRoute = require('./routes/redirectingRoute');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT ||3000 ;
app.use(express.static(path.join(__dirname,"public")));

app.use('/api',redirectingRoute);
app.use('/expenses',expanseRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

sequelize
    .sync()
    .then(result =>{
        app.listen(port, ()=>{
            console.log('server running on port :',port);
        })
    }).catch(err=>console.log(err))