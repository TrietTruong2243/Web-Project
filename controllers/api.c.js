const { Op } = require('sequelize');
const db = require('../models');
const Account = db.Account;
const PaymentHistory = db.PaymentHistory;

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
		return res.status(500).json({ balance: 0 });
	}
};

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

		return res.status(201).json({ msg: 'Successfully' });
	} catch (error) {
		console.error('Function postCreateAccount Error: ', error);
		return res.status(400).json({ msg: error });
	}
};

exports.postPayment = async (req, res) => {
	let { totalMoney, userId } = req.body;
	[totalMoney, userId] = [Number(totalMoney), Number(userId)];
	const tx = await db.transaction();

	try {
		const { balance, id } = await Account.findOne({
			raw: true,
			where: { userId },
			attributes: ['balance', 'id'],
		});

		const afterBalance = balance - totalMoney > 0 ? balance - totalMoney : 0;
		await PaymentHistory.create(
			{
				transactionCode: Date.now().toString(),
				beforeBalance: balance,
				afterBalance,
				totalMoney,
				createdDate: new Date(),
				cardNumber: null,
				cardName: null,
				isPutMoney: false,
				accountId: id,
			},
			{ transaction: tx }
		);
		await Account.update(
			{ balance: afterBalance },
			{ where: { id }, transaction: tx }
		);

		await tx.commit();
		return res.status(200).json({ currentBalance: afterBalance });
	} catch (error) {
		await tx.rollback();
		console.error('Function postPayment Error: ', error);
		return res.status(400).json({});
	}
};
