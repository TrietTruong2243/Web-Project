const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Categories', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Category;
};