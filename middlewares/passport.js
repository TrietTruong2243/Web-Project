const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models/Server');
const User = db.User;
const Image = db.Image;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({
            where: { id },
            attributes: ['id', 'username', 'role', 'status'],
            include: {
                model: Image,
                as: 'image',
            },
        });
        if (!user) {
            return done(null, false);
        }
        if(user.status !== 'active'){
            return done(null, false, { message: 'inactive account' });
        }
        if(user.role !== 'admin'){
            return done(null, false, { message: 'not admin' });
        }
        if(user.dataValues.image) user.dataValues.image = user.dataValues.image.dataValues;
        console.log(user.dataValues);
        done(null, user.dataValues);
    } catch (err) {
        done(err, false);
    }
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return done(null, false, { message: 'invalid username' });
            }
            const check = await bcrypt.compare(password, user.password);
            if (!check) {
                return done(null, false, { message: 'invalid password' });
            }
            if (user.status !== 'active') {
                return done(null, false, { message: 'passport account' });
            }
            return done(null, user);
        } catch (err) {
            console.log(err);
            done(err, false);
        }
    }));
}