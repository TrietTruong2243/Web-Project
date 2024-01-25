const model = require("../models/auth.m");
const jwt = require('jsonwebtoken');
var { validationResult } = require('express-validator');

// let validateRegisterUser = () => {
//     return [ 
//       check('user.name', 'name does not Empty').not().isEmpty(),
//       check('user.name', 'name must be Alphanumeric').isAlphanumeric(),
//       check('user.name', 'name more than 4 degits').isLength({ min: 4 }),
//       check('user.email_address', 'Invalid does not Empty').not().isEmpty(),
//       check('user.email_address', 'Invalid email').isEmail(),
//       // check('user.birthday', 'Invalid birthday').isISO8601('yyyy-mm-dd'),
//       check('user.password', 'password more than 6 degits').isLength({ min: 6 }),
//       check('user.password_confirm ', 'password_confirm more than 6 degits').isLength({ min: 6 })
//     ]; 
//   }
module.exports = {
    userinfo: async (req, res) => {
        res.render("home", { layout: "user_info" })

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
                    err = "Username đã tồn tại, không thể tạo tài khoản "
                    break;
                case -1:
                    err = "Email đã tồn tại, không thể tạo tài khoản "
                    break;
                case 0:
                    err = "Có lỗi, không thể thêm tài khoản "
                    break;
                case 1:
                    break;
            }
            if (err)
            {
                res.json({addErr: err});

            }else{
               res.json("Thêm thành công")
            }
    
        }
        // const { email_address, name, phone_number, home_address, password, password_confirm } = req.body;

        // if (!email_address || !name || !phone_number || !home_address || !password || !password_confirm) {
        //     err = "Thông tin nhập vào chưa đầy đủ"
        // }
        // else 
        // if (password != password_confirm) {
        //     // err.push({msg:'Mật khẩu nhập lại không giống với mật khẩu ban đầu', path:'password_confirm'})
        // }
        // else {
        //addtodatabase
       
        // }
        // res.json(err);
    },
    forgotpasswordFind: async (req, res) => {

    },
    addGGUserInfo: async(req,res)=>{
        const email = req.cookies["email"];
        res.render("home",{layout: 'addgginfo', useremail: email})
    },
    googlesuccesslogin: async (req, res) => {
        const user = req.user;
        if (!user.CustomerName|| !user.PhoneNumber || !user.HomeAddress)
        {
            res.cookie('email' , user.Email)
            return res.redirect("/auth/addgginfo")
        }        
        const accessToken = jwt.sign({ id: user.CustomerID, isGoogleAccount: user.IsGoogleAccount || false }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
        return res.redirect("/")
    },
    googlefailurelogin: async (req, res) => {
        req.flash('error', "Không thể đăng nhập với google");
        res.redirect("/auth/signin")
    },
    ggSuccessAddInfo: async (req,res)=>{
        const email = req.cookies['email'];
        const user = await model.getUserByEmail(email);
        const accessToken = jwt.sign({ id: user.CustomerID, isGoogleAccount: user.IsGoogleAccount || false }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie('token', accessToken, { httpOnly: false, sameSite: true, maxAge: "3000000" });
        res.clearCookie('email')
        res.redirect('/');
    }
    
}