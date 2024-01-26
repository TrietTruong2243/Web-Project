require("dotenv").config();
const app = require('express');
const router = app.Router();
const appControl = require("../controllers/auth.c");
const passport = require('passport');
const bcrypt = require("bcrypt")
const User = require("../models/user.m");
const jwt = require('jsonwebtoken')
const mws = require("../mws/middlewareController")
var LocalStrategy = require('passport-local').Strategy;
router.use(app.static(__dirname+'/../public'));
router.use(passport.initialize());
router.use(passport.session());
var GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        console.log(profile);
        request.user = profile;
        const user = await User.findOrCreateUser({ id: profile.id, email: profile.email });

        return done(null, user)

       
    }
));
passport.use(new LocalStrategy(async (username, password, done) => {

    // let rs = await User.findUserByEmail(username);
    let rs = await User.findUserByUserName(username);
    console.log(rs);
    let auth = false;
    if (rs) {
   
        if (rs.IsGoogleAccount === true) {
            return done(null, false, { message: 'invalid' })
        }
        auth = await bcrypt.compare(password, rs.Password);

    }

    if (auth) {
        return done(null, rs);
    }
    // done('invalid auth');
    done(null, false, { message: 'bad password' })
}));
passport.serializeUser((user, done) => done(null, user.CustomerID));
passport.deserializeUser((username, done) => {
    done(null, false)
});
router.get("/userinfo", mws.verifyToken, appControl.userinfo);
router.get("/signin", appControl.signin)
router.get("/signup", appControl.signup);
router.get("/forgotpassword", appControl.forgotpassword)
router.get("/addgginfo",appControl.addGGUserInfo)
router.post("/forgotpassword/forgotpasswordFind", appControl.forgotpasswordFind);
const { check } = require('express-validator');

let validateRegisterUser = () => {
    return [
        check('name', 'Tên không hợp lệ!').isAlphanumeric(),
        check('name', 'Tên không được trống!').not().isEmpty(),
        
        check('username', 'Username phải nhiều hơn 6 ký tự!').isLength({ min: 6 }),
        check('username', 'Username không được trống!').not().isEmpty(),

        check('email_address', 'Định dạng email không hợp lệ!').isEmail(),
        check('email_address', 'Email không được trống').not().isEmpty(),

        check('phone_number', 'Phonenumber phải đủ 10 số!').isLength(10),
        check('phone_number', 'Phonenumber phải là số!').isNumeric(),
        check('phone_number', 'Phonenumber không được trống!').not().isEmpty(),

        check('home_address', 'Địa chỉ không được trống!').not().isEmpty(),
        check('password', 'Mật khẩu phải nhiều hơn 6 ký tự').isLength({ min: 6 }),
        check('password', 'Mật khẩu không được trống!').not().isEmpty(),

        check('password_confirm', 'Mật khẩu nhập lại không giống với mật khẩu ban đầu!').custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {
                console.log(req.body);
                // trow error if passwords do not match
                throw new Error("Mật khẩu nhập lại không giống với mật khẩu ban đầu!");
            } else {
                return value;
            }
        }),
        check('password_confirm', 'Mật khẩu nhập lại phải nhiều hơn 6 ký tự! ').isLength({ min: 6 }),

        check('password_confirm', 'Mật khẩu nhập lại không được trống!').not().isEmpty(),


    ];
}
router.post("/signup", validateRegisterUser(), appControl.addUser);
router.post("/signin", passport.authenticate('local', { failureRedirect: '/auth/userinfo', failureFlash: 'Invalid username or password' }),
    async function (req, res) {
        const user = await User.findUserByUserName(req.body.username);
        const accessToken = jwt.sign({ id: user.CustomerID, isGoogleAccount: user.IsGoogleAccount || false }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
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
router.get("/ggsuccessaddinfo",appControl.ggSuccessAddInfo)
module.exports = router;