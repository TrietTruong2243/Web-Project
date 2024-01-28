const bcrypt = require('bcrypt');
const db = require('../models');
const Account = db.Account;

exports.getChangePassword = (req, res) => {
	return res.render("home",{layout:"ChangePassword"});
};

exports.postChangePassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	const { id } = req.user;

	try {
		const account = await Account.findByPk(id, {
			raw: true,
			attributes: ['password'],
		});

		if (!account) {
			throw new Error('account does not exists');
		}

		const isCorrectPwd = await bcrypt.compare(oldPassword, account.password);
		if (!isCorrectPwd) {
			return res.render('home', {
				layout: "ChangePassword",
				msg: 'Mật khẩu hiện tại không chính xác',
			});
		}

		const newHashPwd = await bcrypt.hash(newPassword, 10);
		const affectedRows = await Account.update(
			{ password: newHashPwd },
			{ where: { id } }
		);

		if (affectedRows) {
			req.logout();
			res.redirect('/auth/login');
		}
	} catch (error) {
		console.error('Function putChangePassword Error: ', error);
		return res.render('change-password', {
			msg: 'Cập nhật thất bại, thử lại',
		});
	}
};
