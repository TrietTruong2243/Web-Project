const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Orders', {
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'pending'
        },
    });

    return Order;
};