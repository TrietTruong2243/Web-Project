const { formatDate, formatCurrency } = require('../helpers');
const db = require('../models');
const PaymentHistory = db.PaymentHistory;

exports.getPaymentHistory = async (req, res) => {
	const { id } = req.user;
	try {
		const paymentHistories = await PaymentHistory.findAll({
			raw: true,
			where: { accountId: id },
			attributes: {
				exclude: ['paymentId', 'id', 'beforeBalance','accountId','cardNumber','cardName','isPutMoney'],
			},
			order: [['createdAt', 'DESC']],
		});
		// console.log(paymentHistories);
		return res.render('home', { 
			layout:"PaymentHistory",
			paymentHistories,
			helpers: {
				formatDate,
				formatCurrency,
			},
		});
	} catch (error) {
		console.error('Function getPaymentHistory Error: ', error);
		return res.render('404');
	}
};
