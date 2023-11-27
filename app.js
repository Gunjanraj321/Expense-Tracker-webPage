require("dotenv").config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/db');

const verify = require('./middleware/verifyTokenHandler');

const userRoute = require('./routes/userRoute');
const expanseRouter = require('./routes/expanseRoute');
const redirectingRoute = require('./routes/redirectingRoute');
const premiumRoute = require('./routes/premiumRoute');

const User = require('./models/userModel');
const Expanse = require('./models/expanseModel');
const Order = require('./models/orderModel');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT ;
app.use(express.static(path.join(__dirname,"public")));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

Expanse.belongsTo(User , {
    foreignKey: "userId",
    onDelete:"CASCADE",
});
User.hasMany(Expanse, {
    foreignKey:"userId",
    onDelete:"CASCADE",
});
Order.belongsTo(User,{
    foreignKey:"userId",
    onDelete:"CASCADE",
})
User.hasMany(Order,{
    foreignKey:"userId",
    onDelete: "CASCADE",
})

app.use('/api',userRoute);
app.use('/api',redirectingRoute);
app.use('/expenses',verify.verify,expanseRouter);
app.use('/api/premium',verify.verify,premiumRoute)
sequelize
    .sync()
    .then(result =>{
        app.listen(port, ()=>{
            console.log('server running on port :',port);
        })
    }).catch(err=>console.log(err))