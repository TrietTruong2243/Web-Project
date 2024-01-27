const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CartItem = sequelize.define('CartItems', {
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    });

    return CartItem;
};