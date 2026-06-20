const {DataTypes} = require('sequelize');
const db = require('../config/database');

const Alert = db.define('Alert', {
    coin: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetPrice: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
    }
},{
    tableName: 'price_alerts'
});