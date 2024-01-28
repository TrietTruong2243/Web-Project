const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	const PaymentHistory = sequelize.define(
		'PaymentHistory',
		{
			transactionCode: {
				type: DataTypes.STRING(15),
				allowNull: false,
			},
			beforeBalance: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0,
				},
			},
			afterBalance: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0,
				},
			},
			totalMoney: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0,
				validate: {
					min: 0,
				},
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			cardNumber: {
				type: DataTypes.STRING(16),
				allowNull: true,
			},
			cardName: {
				type: DataTypes.STRING(75),
				allowNull: true,
			},
			isPutMoney: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		},
	);

	return PaymentHistory;
}
