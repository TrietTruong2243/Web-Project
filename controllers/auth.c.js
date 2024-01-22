const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Admin = db.Admin;

module.exports = {
    // [GET] /login
    getLogin: (req, res, next) => {
        if (req.user) {
            return res.redirect('/');
        }
        res.render('login', {
            layout: false
        });
    },

    // [POST] /login
    login: (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
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
                const retUrl = req.query.retUrl || '/';
                req.logIn(user, (err) => {
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
        res.redirect('/login');
    },
}