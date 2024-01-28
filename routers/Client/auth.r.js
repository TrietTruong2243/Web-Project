require("dotenv").config();
const app = require('express');
const router = app.Router();
const appControl = require("../../controllers/Client/auth.c");
const passport = require('passport');
const bcrypt = require("bcrypt")
const User = require("../../models/Client/user.m");
const jwt = require('jsonwebtoken')
const mws = require("../../mws/Client/middlewareController")
const passwordvalidator = require("password-validator")
var LocalStrategy = require('passport-local').Strategy;
router.use(app.static(__dirname + '/../public'));
router.use(passport.initialize());
router.use(passport.session());
var GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        request.user = profile;
        const user = await User.findOrCreateUser({ email: profile.email });

        return done(null, user)


    }
));
passport.use('local1', new LocalStrategy(async (username, password, done) => {

    let rs = await User.findUserByUserName(username);
    let auth = false;
    if (rs) {

        if (rs.IsGoogleAccount === true) {
            return done(null, false, { message: 'invalid' })
        }
        // if (rs.status == 'banned') {
        //     return done(null, false, { message: 'invalid' })

        // }
        auth = await bcrypt.compare(password, rs.password);

    }

    if (auth) {
        return done(null, rs);
    }
    // done('invalid auth');
    done(null, false, { message: 'bad password' })
}));
// passport.serializeUser((user, done) => done(null, user.CustomerID));
// passport.deserializeUser((username, done) => {
//     done(null, false)
// });
router.get("/userinfo", mws.verifyToken, appControl.userinfo);
router.get("/signin", appControl.signin)
router.get("/signup", appControl.signup);
router.get("/forgotpassword", appControl.forgotpassword)
router.get("/addgginfo", appControl.addGGUserInfo)
router.post("/forgotpassword/forgotpasswordFind", appControl.forgotpasswordFind);
const { check } = require('express-validator');

let validateRegisterUser = () => {
    return [
        check('name', 'Invalid fullname!').isAlphanumeric(),
        check('name', 'Fullname must not empty!').not().isEmpty(),

        check('username', 'Username must be more than 6 characters').isLength({ min: 6 }),
        check('username', 'Username  must not empty!').not().isEmpty(),

        check('email_address', 'Invalid email!').isEmail(),
        check('email_address', 'Email must not empty').not().isEmpty(),

        check('phone_number', 'Phonenumber must have 10 numbers!').isLength({ min: 10, max: 10 }),
        check('phone_number', 'Phonenumber must be number!').isNumeric(),
        check('phone_number', 'Phonenumber must not empty!').not().isEmpty(),

        check('home_address', 'Address must not empty!').not().isEmpty(),
        check('password', 'Password must have at least 1 uppercase, 1 lowercase and 1 special characters').matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
          ),
          check('password', 'Password lenght must more than 6 characters').isLength({ min: 6 }),

        check('password', 'Password must not wmpty!').not().isEmpty(),

        check('password_confirm', 'Confirm password is not the same as the original password!').custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {

                throw new Error("Confirm password is not the same as the original password!");
            } else {
                return value;
            }
        }),
        check('password_confirm', 'Confirm password length must more than 6!').isLength({ min: 6 }),

        check('password_confirm', 'Confirm password must not empty!').not().isEmpty(),


    ];
}
// let validatePassword = () => {
//     return new [
//         passwordvalidator('password', 'Mật khẩu phải nhiều hơn 6 ký tự').isLength({ min: 6 }),
//         passwordvalidator('password', 'Mật khẩu phải có ký tự thường').has().lowercase(),
//         passwordvalidator('password', 'Mật khẩu phải có ký tự in hoa').has().uppercase(),
//         passwordvalidator('password', 'Mật khẩu phải có ký tự đặc biệt').has(),
//         passwordvalidator('password_confirm', 'Mật khẩu nhập lại không giống với mật khẩu ban đầu!').custom((value, { req, loc, path }) => {
//             if (value !== req.body.password) {

//                 throw Error("Mật khẩu nhập lại không giống với mật khẩu ban đầu!");
//             } else {
//                 return value;
//             }
//         }),
//     ]
// }
router.post("/signup", validateRegisterUser(), appControl.addUser);
router.post("/signin", passport.authenticate('local1', { failureRedirect: '/auth/userinfo', failureFlash: 'Invalid username or password' }),
    async function (req, res) {
        const user = await User.findUserByUserName(req.body.username);
        console.log(user);
        const accessToken = jwt.sign({ id: user.id, isGoogleAccount: user.isGGAcc || false, role: user.role ,status: user.status}, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "300000000" });
        res.redirect("/")
    }
);
router.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        // successRedirect: '/google/success',
        failureRedirect: '/google/failure'
    }), appControl.googlesuccesslogin);
router.get('/google/success', appControl.googlesuccesslogin);
router.get('/google/failure', appControl.googlefailurelogin)
router.get("/signout", function (req, res) {
    req.logOut(function (err) {
        // if (err) { return next(err); }
        res.clearCookie('token')
        res.redirect('/');
    })
})
router.get("/ggsuccessaddinfo", appControl.ggSuccessAddInfo)
module.exports = router;