const model = require("../../models/Client/auth.m");
const jwt = require('jsonwebtoken');
var { validationResult } = require('express-validator');


module.exports = {
    userinfo: async (req, res) => {
        let isAdmin = false;
        if (req.user.role==='admin')
        {
            isAdmin = true
        }
        res.render("home", { layout: "user_info" , isAdmin: isAdmin})

    },
    signin: async (req, res) => {
        try {
            const err = req.flash('error')
            res.render("home", { layout: "signin", isSignIn: true, loginErr: err });

        }
        catch (err) {
            res.render("home", { layout: "signin", isSignIn: true });

        }
    },

    signup: async (req, res) => {
        res.render("home", { layout: "signin", isSignUp: true });
    },
    forgotpassword: async (req, res) => {
        res.render("home", { layout: "signin", isForgotPassword: true });
    },
    addUser: async (req, res) => {

        var err1 = validationResult(req);
        if (err1.errors.length)
        {
            res.json({err: err1.errors})
        }
        else{
            const addUser = await model.addNewUser(req.body);
            var err;
            switch (addUser) {
                case -2:
                    err = "Username already exists, cannot create account!"
                    break;
                case -1:
                    err = "Email already exists, cannot create account!"
                    break;
                case 0:
                    err = "Error, cannot add account!"
                    break;
                case 1:
                    break;
            }
            if (err)
            {
                res.json({addErr: err});

            }else{
               res.json("Success")
            }
    
        }
       
    },
    forgotpasswordFind: async (req, res) => {

    },
    addGGUserInfo: async(req,res)=>{
        const email = req.cookies["email"];
        res.render("home",{layout: 'addgginfo', useremail: email})
    },
    googlesuccesslogin: async (req, res) => {
        const user = req.user;
        if (!user.fullname||!user.username|| !user.phone || !user.address)
        {
            res.cookie('email' , user.email)
            return res.redirect("/auth/addgginfo")
        }        
        const accessToken = jwt.sign({ id: user.id, isGoogleAccount: user.isGGAcc || false , role: user.role, status: user.status}, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
        return res.redirect("/")
    },
    googlefailurelogin: async (req, res) => {
        req.flash('error', "Cannot sign in with google");
        res.redirect("/auth/signin")
    },
    ggSuccessAddInfo: async (req,res)=>{
        const email = req.cookies['email'];
        const user = await model.getUserByEmail(email);
   
        const accessToken = jwt.sign({ id: user.id, isGoogleAccount: user.isGGAcc || false, role: user.role,status: user.status }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
        res.clearCookie('email')
        res.redirect('/');
    }
    
}