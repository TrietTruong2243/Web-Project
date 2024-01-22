const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const OrderItem = sequelize.define('OrderItems', {
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Products',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Orders',
                key: 'id'
            }
        },
    });

    return OrderItem;
};