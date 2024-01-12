require("dotenv").config();
const app = require('express');
const router = app.Router();
const appControl = require("../controllers/auth.c");
const passport = require('passport');
const bcrypt = require("bcrypt")
const User = require("../db/db_user_helpers")
var LocalStrategy = require('passport-local').Strategy;
router.use(passport.initialize());
router.use(passport.session());
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
passport.use(new GoogleStrategy({
    clientID:     '7818524727-1ia978rpjj26a5ctqvparepfi0oo17ir.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));
passport.use(new LocalStrategy(async (username, password, done) => {
    let rs = await User.findUserByEmail(username);
    let auth = false;
    if (rs) {
        auth = await bcrypt.compare(password, rs.Password);
        console.log(auth);
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
router.get("/userinfo", appControl.userinfo);
router.get("/signup",appControl.signup);
router.get("/forgotpassword",appControl.forgotpassword)
router.post("/forgotpassword/forgotpasswordFind",appControl.forgotpasswordFind)
router.post("/signup",appControl.addUser);
router.post("/signin", passport.authenticate('local', { failureRedirect: '/auth/userinfo', failureFlash: 'Invalid username or password' }),
function (req, res) {
//     console.log(req.body);
//     const accessToken = jwt.sign({ MSSV: req.body.username }, process.env.SECRET_KEY, { expiresIn: "1h" });
//     res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
//     // res.setHeader('Authorization', `Bearer ${accessToken}`);
//     res.set('authorization', accessToken);
//     // req.session.token = token ;
//     // res.header("fa", "fa1")
//     res.redirect('/');
// }
    res.redirect("/")
}
);
router.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/google/success',
        failureRedirect: '/google/failure'
}));
router.get('/google/success', appControl.googlesuccesslogin);
router.get('/google/failure',appControl.googlefailurelogin)
module.exports = router;