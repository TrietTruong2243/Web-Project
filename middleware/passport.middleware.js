const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const Account = db.Account;
const bcrypt = require('bcrypt');
const { MAX } = require('../constants');

passport.use(
	new LocalStrategy(async function (username, password, done) {
		try {
			// check if account existence
			const account = await Account.findOne({
				where: { username },
				raw: true,
			});

			// if not exist
			if (!account) {
				return done(null, false, {
					msg: 'Tài khoản không tồn tại !',
					username,
				});
			}

			const {
				password: accountPwd,
				userId,
				id,
			} = account;

			// check empty password -> if null -> create password
			if (!accountPwd) {
				return done(null, false, { isCreatePwd: true, username });
			}

			// else check password
			const isCorrectPwd = await bcrypt.compare(password, accountPwd);

			if (isCorrectPwd) {
				return done(null, { username, userId, id });
			}

			// if the password is incorrect
			return done(null, false, {
				msg: 'Mật khẩu không chính xác',
				username,
			});
		} catch (error) {
			console.error('PASSPORT LOCAL STRATEGY ERROR: ', error);
			return done(error, false);
		}
	})
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(async function (user, done) {
	const { username } = user;
	try {
		const account = await Account.findOne({ 
			where: { username },
			raw: true,
			attributes: ['id', 'username', 'userId']
		 });
		if (account) {
			return done(null, user);
		}

		return done(null, false);
	} catch (error) {
		console.log('PASSPORT DESERIALIZE ERROR: ', error);
		done(error, false);
	}
});
