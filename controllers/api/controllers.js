const paymentApi = require('../../payment-api')
const jwt = require('jsonwebtoken')
module.exports = {
    // [POST] /api/create-payment-account
    createPaymentAccount: async (req, res, next) => {
        try {
            // const { username, userId } = req.body
            const username = req.session.user.username
            const userId =req.session.user.id
            
            const result = await paymentApi.createPaymentAccount({ username, userId })
            if (result) {
                // res.status(201).json({ msg: 'Successfully' })
                res.redirect("/")
            } else {
                res.status(400).json({ msg: 'Failed' })
            }
        } catch (error) {
            next(error)
        }
    },

    // [POST] /api/check-account
    checkAccount: async (req, res, next) => {
        try {
            const { totalMoney, userId } = req.query;
            // check account
            const accountId = await paymentApi.checkAccount({ userId, totalMoney });
            if (!accountId) {
                res.status(400).json({ msg: 'Failed' });
            } else {
                res.status(200).json({ accountId });
            }

        } catch (error) {
            next(error)
        }
    },

    // [POST] /api/payment
    postPayment: async (req, res, next) => {
        try {
            const { accountId, totalMoney, password: accountPassword } = req.body;
            const token = jwt.sign(
                {
                    sub: {
                        accountId,
                        totalMoney,
                        accountPassword,
                    },
                    exp: Date.now() + 1000_000, // 10 mins
                },
                process.env.JWT_CHECKOUT_SECRET
            );
 
            const result = await paymentApi.postPayment({ token });
            console.log(result);
            if (result.currentBalance) {
                res.status(201).json({ msg: 'Successfully', data: result })
            } else if(result.error) {
                res.status(400).json({ msg: 'Failed', error: result.error })
            } else {
                res.status(400).json({ msg: 'Failed' })
            }
        } catch (error) {
            next(error)
        }
    },

    // [GET] /api/balance/:userId
    getUserBalance: async (req, res, next) => {
        try {
            const { userId } = req.params
            const result = await paymentApi.getUserBalance(userId)
            if (result) {
                res.status(201).json({ data: result, msg: 'Successfully' })
            } else {
                res.status(400).json({ msg: 'Failed' })
            }
        } catch (error) {
            next(error)
        }
    }
}