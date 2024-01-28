const BANK_LIST = require('../constants/bank-list');
const jwt = require('jsonwebtoken');
const {
	MAX,
	JWT_CHECKOUT_SUCCESS_KEY,
	TRACKING_QUERY_KEY,
	PRIVATE_KEY,
} = require('../constants');
const db = require('../models');
const Account = db.Account;
const PaymentHistory = db.PaymentHistory;

// [GET] /put-money
exports.getPutMoneyPage = (req, res) => {
	const token = req.query[TRACKING_QUERY_KEY];

	return res.render('put-money.pug', {
		bankList: BANK_LIST,
		token,
	});
};

// [GET] /put-money/checkout-success
exports.getCheckoutSuccess = async (req, res) => {
	console.log('req.query in getCheckoutSuccess: ', req.query);
	const { token } = req.query;
	const tx = await db.sequelize.transaction();

	try {
		const jwtData = jwt.verify(token, JWT_CHECKOUT_SUCCESS_KEY);
		if (!jwtData) throw new Error('Invalid token: jwt.verify returned null');

		let {
			transactionCode,
			totalMoney,
			bank,
			accountId,
			cardNumber,
			token: AToken,
		} = jwtData.sub;
		[totalMoney, accountId] = [totalMoney, accountId].map(Number);

		const account = await Account.findOne({ raw: true, where: { id: accountId } });
		if (!account) throw "Account doesn't exist";
		const currentBalance = Number(account.balance);

		let newBalance = currentBalance + totalMoney;
		let promises = [];

		promises.push(
			PaymentHistory.create(
				{
					transactionCode,
					totalMoney,
					accountId,
					cardNumber,
					cardName: bank,
					content: 'Nạp tiền',
					isPutMoney: true,
					beforeBalance: currentBalance,
					afterBalance: newBalance,
				},
				{ transaction: tx }
			)
		);

		// promises.push(Account.increment('balance', { by: totalMoney, where: { id: 1 }}, { transaction: tx }));
		promises.push(
			Account.update(
				{ balance: newBalance },
				{ where: { id: accountId }, transaction: tx }
			)
		);

		await Promise.all(promises);
		await tx.commit();

		if (AToken) {
			const { callbackUrl } = jwt.decode(AToken, PRIVATE_KEY).sub;
			return res.redirect(callbackUrl);
		} else {
			req.session.putMoneyStatus = '1';
			return res.redirect('/dashboard');
		}
	} catch (error) {
		console.error('Function getCheckoutSuccess Error: ', error);
		req.session.putMoneyStatus = '0';
		await tx.rollback();
		return res.redirect('/dashboard');
	}
};

// [POST] /put-money/checkout
exports.postCheckoutPutMoney = async (req, res) => {
	const { totalMoney, bank, token } = req.body;
	const { id: accountId } = req.user;
	const rootUrl = `${req.protocol}://${req.get('host')}`;

	const fakePaymentToken = jwt.sign(
		{
			issuer: 'SkullPay',	
			iat: Date.now(),
			exp: Date.now() + MAX.CHECKOUT_JWT_EXP,
			sub: {
				accountId,
				totalMoney,
				bank,
				successTokenKey: JWT_CHECKOUT_SUCCESS_KEY,
				callback: `${rootUrl}/put-money/checkout-success`,
				token,
			},
		},
		process.env.JWT_CHECKOUT_SECRET
	);

	const fakePaymentSystemUrl = `${rootUrl}/fake-payment-system/checkout?token=${fakePaymentToken}`;

	return res.status(200).json({
		url: fakePaymentSystemUrl,
	});
};
