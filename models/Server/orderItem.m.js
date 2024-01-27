const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderItem = sequelize.define('OrderItems', {
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    });

    return OrderItem;
};