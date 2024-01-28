const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            // allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        status: {
            type: DataTypes.STRING(10),
            defaultValue: 'active'
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'customer'
        },
        fullname: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        isGGAcc:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
};