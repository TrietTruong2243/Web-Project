const model = require("../models/app.m")
// const passport = require('passport');
// const app = require('express');
// var LocalStrategy = require('passport-local').Strategy;
// // app.use(passport.initialize());
// // app.use(passport.session());
// var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

// passport.use(new GoogleStrategy({
//     clientID:     '7818524727-1ia978rpjj26a5ctqvparepfi0oo17ir.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: "http://localhost:3000/auth/google/callback",
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     //   return done(err, user);
//     // });
//   }
// ));
// passport.use(new LocalStrategy(async (username, password, done) => {
//     // console.log(`username:::${username}, pass::::${ password}`);
//     const rs = await User.getUserByID(username);
//     // console.log(rs);
//     let auth = false;
//     if (rs) {
//         auth = await bcrypt.compare(password, rs.MATKHAU);
//     }

//     if (auth) {
//         return done(null, rs);
//     }
//     // done('invalid auth');
//     done(null, false, { message: 'bad password' })
// }));
// passport.serializeUser((user, done) => done(null, user.MSSV));
// passport.deserializeUser((username, done) => {
  
//     done(null, false)
// });
module.exports = {
    homepage: async (req,res)=>{
        res.render("home")
    },
    
}