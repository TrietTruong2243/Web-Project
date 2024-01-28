require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const { MAX } = require('./constants');
const session = require('express-session');
const passport = require('passport');

const db = require('./models');
// db.sequelize.sync({force: true});
const Account = db.Account;
const PaymentLimit = db.PaymentLimit;

/* ============== Import apis, middlewares =============== */
const { apiAuthentication } = require('./middleware/authentication.middleware');
const { authMiddleware, unlessRoute } = require('./middleware/auth.middleware');
const apiRoute = require('./routes/api.r');
const authRoute = require('./routes/auth.r');
const dashboardRoute = require('./routes/dashboard.r');
const paymentHistoryRoute = require('./routes/payment-history.r');
const changePasswordRoute = require('./routes/change-password.r');
const putMoneyRoute = require('./routes/put-money.r');
const fakePaymentSystemRoute = require('./routes/fake-payment-system.r');

/* ============== Config =============== */
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIE || 'signed_cookie'));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'session_secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: MAX.SESSION_EXP,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

/* ============== Routes =============== */
// app.use(unlessRoute(['/auth', '/api', '/wakeup-heroku'], authMiddleware));
app.use('/api', apiAuthentication, apiRoute);
app.use('/auth', authRoute);
app.use('/*', authMiddleware);
app.use('/dashboard', dashboardRoute);
app.use('/payment-history', paymentHistoryRoute);
app.use('/change-password', changePasswordRoute);
app.use('/put-money', putMoneyRoute);
app.use('/fake-payment-system', fakePaymentSystemRoute);
app.use('/', (req, res) => res.redirect('/dashboard'));
// error handler
app.use((req, res) => res.status(404).json({ message: 'Page not found' }));

/* ============== Listening =============== */
const PORT = process.env.PORT || 3001;
db.sequelize.sync({ after: true }).then((_) => {
    app.listen(PORT, () => {
        // Create a main account (admin, admin), payment limit if not exists
        Account.count().then((count) => {
            if (!count) {
                Account.create({
                    username: 'admin',
                    userId: 1,
                    password: '',
                });
            }
        });
        console.log(`Server is listening on port ${PORT}`);
    });
});

