const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Orders', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'pending'
        },
    });

    return Order;
};