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
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categories',
                key: 'id'
            },
            onDelete: 'cascade'
        },
        mainImageId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Images',
                key: 'id'
            },
            onDelete: 'set null'
        }
    });

    return Product;
};