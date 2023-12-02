const sequelize = require('../util/db');
const Sequelize = require('sequelize');
const UUID = require('uuid')

const forgotPasswordReq = sequelize.define(
    "forgotPasswordReq",{
        id:{
            type:Sequelize.UUID,
            primaryKey:true,
            defaultValue:UUID.v4(),
        },
        isactive: {
            type:Sequelize.BOOLEAN,
            defaultValue:true,
        }
    }
)

module.exports = forgotPasswordReq;