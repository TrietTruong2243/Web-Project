require('dotenv').config();
const { Op } = require('sequelize');
const db = require('../models');
const Account = db.Account;
const PaymentHistory = db.PaymentHistory;
const jwt = require('jsonwebtoken');
const { TRACKING_QUERY_KEY } = require('../constants');
const bcrypt = require('bcrypt');

// [GET] /api/balnace/:userId
exports.getUserBalance = async (req, res) => {
	const userId = Number(req.params.userId);

	try {
		const account = await Account.findOne({
			raw: true,
			where: { userId },
			attributes: ['balance'],
		});

		return res.status(200).json({ balance: account?.balance || 0 });
	} catch (error) {
		console.error('Function getUserBalance Error: ', error);
		return res.status(500).json({});
	}
};

// [GET] /api/check-account
exports.getCheckAccount = async (req, res) => {
	let { userId, totalMoney } = req.query;

	try {
		const account = await Account.findOne({
			raw: true,
			where: { userId },
			attributes: ['balance', 'id'],
		});

		if (!account) {
			throw new Error('Account not found!');
		}

		let { balance } = account;
		balance = Number(balance);
		totalMoney = Number(totalMoney);
		if (balance < totalMoney) {
			throw new Error('Not enough money!');
		}
		return res.status(200).json({ accountId: account.id });
	} catch (error) {
		console.error('Function getCheckAccount Error: ', error);
		return res.status(400).json({error: error.message});
	}
}

// [POST] /api/payment/create-account
exports.postCreateAccount = async (req, res) => {
	const { username, userId } = req.body;

	try {
		if (!username || !userId) {
			throw 'username & userId is required!';
		}

		const doesExist = await Account.findOne({
			where: {
				[Op.or]: [{ username }, { userId }],
			},
		});
		if (doesExist) {
			throw 'Account already exists!';
		}

		const newAccount = await Account.create({
			username,
			userId,
			password: '',
			balance: 0,
		});

		if (!newAccount) {
			throw 'Account creation failed!';
		}

		return res.status(201).json({ accountId: newAccount.id });
	} catch (error) {
		console.error('Function postCreateAccount Error: ', error);
		return res.status(400).json({});
	}
};

// [POST] /api/payment
exports.postPayment = async (req, res) => {
	const tx = await db.sequelize.transaction();
	try {
		const { token } = req.body;
		const jwtData = jwt.verify(token, process.env.JWT_CHECKOUT_SECRET);
		let {
			totalMoney,
			accountId,
			accountPassword,
		} = jwtData.sub;

		const account = await Account.findOne({
			raw: true,
			where: { id: accountId },
		});

		console.log('account: ', account);
		if (!account) {
			throw new Error('Account not found!');
		}
		
		// check password
		const isCorrectPwd = await bcrypt.compare(accountPassword, account.password);
		if (!isCorrectPwd) {
			throw new Error('Wrong password!');
		}

		let { balance } = account;
		const afterBalance = balance - totalMoney > 0 ? balance - totalMoney : 0;
		// create payment history
		await PaymentHistory.create(
			{
				transactionCode: Date.now().toString(),
				beforeBalance: balance,
				afterBalance,
				totalMoney,
				content: 'Thanh toán',
				cardNumber: null,
				cardName: null,
				isPutMoney: false,
				accountId,
			},
			{ transaction: tx }
		);
		// update account balance
		await Account.update(
			{ balance: afterBalance },
			{ where: { id: accountId }, transaction: tx }
		);
		// transfer money to admin
		await Account.increment(
			'balance',
			{ by: totalMoney, where: { id: 1 } },
			{ transaction: tx }
		);

		await tx.commit();
		return res.status(200).json({ currentBalance: afterBalance });
	} catch (error) {
		await tx.rollback();
		console.error('Function postPayment Error: ', error);
		return res.status(400).json({error: error.message});
	}
};
