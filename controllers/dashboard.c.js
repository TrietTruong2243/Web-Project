const { formatCurrency } = require('../helpers');
const db = require('../models');
const Account = db.Account;

exports.getDashboardPage = async (req, res) => {
	const { userId } = req.user;
	let { putMoneyStatus = null } = req.session;
	// console.log(putMoneyStatus);
	if (putMoneyStatus) {
		req.session.putMoneyStatus = null;
	}

	try {
		const account = await Account.findOne({
			raw: true,
			where: { userId },
			attributes: ['balance'],
		});
		let balance = account?.balance || 0;
		balance = formatCurrency(balance);
		res.render('home', { 
			layout:"DashBoard",
			balance: balance,
			msg: putMoneyStatus
					? putMoneyStatus == '1'
					? 'Nạp tiền thành công'
					: 'Nạp tiền thất bại'
					: null,
			isPutMoneySuccess: putMoneyStatus == '1' ? true : false,
			helpers: {
				formatCurrency,
			},
		});
	} catch (error) {
		console.log('getDashboardPage ERROR: ', error);
		return res.render('404.pug');
	}
};
