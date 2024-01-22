const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Products', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        description: DataTypes.TEXT,
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    });

    return Product;
};