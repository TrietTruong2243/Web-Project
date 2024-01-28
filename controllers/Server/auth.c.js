const db = require('../../models/Server');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Admin = db.Admin;

module.exports = {
    // [GET] /login
    getLogin: (req, res, next) => {
        if (req.user) {
            return res.redirect('/admin');
        }
        res.render('login', {
            layout: false
        });
    },

    // [POST] /login
    login: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/admin/',
            failureRedirect: '/admin/login',
            failureFlash: true
        },
            (err, user, info) => {
                const error = info ? info.message : "";
                console.log(error);
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.render('login', {
                        layout: false,
                        message: error
                    });
                }
                const retUrl = req.query.retUrl || '/admin/';
                req.logIn(user, (err) => {
                    // console.log(user);
                    res.isAuthenticated = true
                    res.locals.isAuthenticated = true

                    if (err) {
                        return next(err);
                    }
                    return res.redirect(retUrl);
                });
            }
        )(req, res, next);
    },

    // [GET] /logout
    logout: (req, res, next) => {
        req.logOut(err => {
            console.log(err);
        });
        res.redirect('/admin/login');
    },
}