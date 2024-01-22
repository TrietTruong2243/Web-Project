const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Image = sequelize.define('Images', {
        public_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return Image;
};