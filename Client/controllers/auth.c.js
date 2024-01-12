const model = require("../models/auth.m");
module.exports = {
    userinfo: async (req, res) => {
        try{
            const err = req.flash('error')
            res.render("home", { layout: "signin", isSignIn: true, loginErr: err });

        }
        catch(err)
        {
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
        // console.log(req.body);
        var err;
        const { email_address, name, phone_number, home_address, password, password_confirm } = req.body;

        if (!email_address || !name || !phone_number || !home_address || !password || !password_confirm) {
            err = "Thông tin nhập vào chưa đầy đủ"
        }
        else if (password != password_confirm) {
            err = "Mật khẩu không hợp lệ!"
        }
        else {
            //addtodatabase
            const addUser = await model.addNewUser(req.body);
            switch (addUser) {
                case -1:
                    err = "Email đã tồn tại, không thể tạo tài khoản "
                    break;
                case 0:           
                     err = "Có lỗi, không thể thêm tài khoản "
                    break;
                case 1:
                    break;
            }
            
        }
        res.json(err);
    },
    forgotpasswordFind: async (req, res) => {
        
    },
    googlesuccesslogin: async (req, res) => {

    },
    googlefailurelogin: async (req, res) => {

    }
}