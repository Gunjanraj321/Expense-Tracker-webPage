require("dotenv").config();

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/db');
const morgan = require("morgan");
// const helmet = require('helmet');

const verify = require('./middleware/verifyTokenHandler');

const userRoute = require('./routes/userRoute');
const expanseRouter = require('./routes/expanseRoute');
const redirectingRoute = require('./routes/redirectingRoute');
const premiumRoute = require('./routes/premiumRoute');
const forgotPasswordRoute = require('./routes/forgotPasswordRoute');

const User = require('./models/userModel');
const Expanse = require('./models/expanseModel');
const Order = require('./models/orderModel');
const forgotPasswordReq = require('./models/forgotPassword');

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

const app = express();

app.use(express.json());
app.use(cors());
// app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname,"public")));
// app.use(morgan("combined", { stream: accessLogStream }));

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
forgotPasswordReq.belongsTo(User,{
    foreignKey:"userId"
})
User.hasMany(forgotPasswordReq,{
    foreignKey:"userId"
})

app.use('/api/redirecting',redirectingRoute);
app.use('/api/sign',userRoute);
app.use('/api/reset',forgotPasswordRoute);
app.use('/expenses',verify.verify,expanseRouter);
app.use('/api/premium',verify.verify,premiumRoute);


async function initiate() {
        try {
            await sequelize.sync().then(console.log("DB Connected"))
            app.listen(port, () => {
                console.log(`Server is running on ${port}`);
                app.use("/api", redirectingRoute);
            });
        } catch (err) {
            console.error("Error initializing server:", err);
        }
    }
initiate();