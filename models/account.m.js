const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const Account = sequelize.define(
		'Account',
		{
			username: {
				type: DataTypes.STRING(30),
				unique: true,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING(72),
				allowNull: true,
			},
			balance: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0,
				},
			},
		}
	);
	
	return Account;
}