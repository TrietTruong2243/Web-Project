const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Orders', {
        status: {
            type: DataTypes.STRING(20),
            defaultValue: 'pending'
        }
    });

    return Order;
};