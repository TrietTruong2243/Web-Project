require('dotenv').config
const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    if (req.isAuthenticated() || req.cookies.token) {
        const token = req.cookies.token;
        if (token) {
            const accessToken = token;
            jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
                if (err) {
                    res.redirect('/')
                }
                else if (user.status == 'banned' || user.role!= 'admin') {
                    res.redirect('/')
                }
                else {
                    req.user = user;
                    return next();

                }
            })
        } else {
            return res.redirect('/');
        }
    }
}