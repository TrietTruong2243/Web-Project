require("dotenv").config();
const app = require('express');
const router = app.Router();
const mws = require("../mws/middlewareController")
const userControl = require("../controllers/user.c");
const { check } = require('express-validator');
router.use(app.static(__dirname+'/../public'));
let validateUserInfo = () => {
    return [
        check('name', 'Tên không hợp lệ!').isAlphanumeric(),
        check('name', 'Tên không được trống!').not().isEmpty(),
        check('username', 'Tên phải dài hơn 6 ký tự!').isLength({min: 6}),
        check('username', 'Tên không được trống!').not().isEmpty(),

        check('email_address', 'Định dạng email không hợp lệ!').isEmail(),
        check('email_address', 'Email không được trống').not().isEmpty(),

        check('phone_number', 'Phonenumber phải đủ 10 số!').isLength(10),
        check('phone_number', 'Phonenumber phải là số!').isNumeric(),
        check('phone_number', 'Phonenumber không được trống!').not().isEmpty(),

        check('home_address', 'Địa chỉ không được trống!').not().isEmpty(),
        // check('password', 'Mật khẩu phải nhiều hơn 6 ký tự').isLength({ min: 6 }),
        // check('password', 'Mật khẩu không được trống!').not().isEmpty(),

        // check('password_confirm', 'Mật khẩu nhập lại không giống với mật khẩu ban đầu!').custom((value, { req, loc, path }) => {
        //     if (value !== req.body.password) {
        //         // trow error if passwords do not match
        //         throw new Error("Mật khẩu nhập lại không giống với mật khẩu ban đầu!");
        //     } else {
        //         return value;
        //     }
        // }),
        // check('password_confirm', 'Mật khẩu nhập lại phải nhiều hơn 6 ký tự! ').isLength({ min: 6 }),
        // check('password_confirm', 'Mật khẩu nhập lại không được trống!').not().isEmpty(),
        // check('current_password', 'Mật khẩu nhập lại phải nhiều hơn 6 ký tự! ').isLength({ min: 6 }),
        // check('current_password', 'Mật khẩu nhập lại không được trống!').not().isEmpty(),

    ];
};
let validateUserPassword = () => {
    return [
    
        check('password', 'Mật khẩu phải nhiều hơn 6 ký tự').isLength({ min: 6 }),
        check('password', 'Mật khẩu không được trống!').not().isEmpty(),

        check('password_confirm', 'Mật khẩu nhập lại không giống với mật khẩu ban đầu!').custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {
                // trow error if passwords do not match
                throw new Error("Mật khẩu nhập lại không giống với mật khẩu ban đầu!");
            } else {
                return value;
            }
        }),
        check('password_confirm', 'Mật khẩu nhập lại phải nhiều hơn 6 ký tự! ').isLength({ min: 6 }),
        check('password_confirm', 'Mật khẩu nhập lại không được trống!').not().isEmpty(),
        check('current_password', 'Mật khẩu nhập lại phải nhiều hơn 6 ký tự! ').isLength({ min: 6 }),
        check('current_password', 'Mật khẩu nhập lại không được trống!').not().isEmpty(),

    ];
};
let validateGGUserInfo = () => {
    return [
        check('name', 'Tên không hợp lệ!').isAlphanumeric(),
        check('name', 'Tên không được trống!').not().isEmpty(),
        check('username', 'Username phải dài hơn 6 ký tự!').isLength({min: 6}),
        check('username', 'Username không được trống!').not().isEmpty(),
        check('email_address', 'Định dạng email không hợp lệ!').isEmail(),
        check('email_address', 'Email không được trống').not().isEmpty(),
        check('phone_number', 'Phonenumber phải đủ 10 số!').isLength(10),
        check('phone_number', 'Phonenumber phải là số!').isNumeric(),
        check('phone_number', 'Phonenumber không được trống!').not().isEmpty(),
        check('home_address', 'Địa chỉ không được trống!').not().isEmpty(),
    
    ];
}
router.get("/accountsettings",mws.verifyToken, userControl.accountsettings)
router.get("/accountorders",mws.verifyToken, userControl.accountorders)
router.post("/changeuserinfo",mws.verifyToken,validateUserInfo(),userControl.changeUserInfo)
router.post("/changegguserinfo",mws.verifyToken,validateGGUserInfo(),userControl.changeGGUserInfo)
router.post("/addgguserinfo",validateGGUserInfo(),userControl.addGGUserInfo)
router.post("/changeuserpassword",mws.verifyToken, validateUserPassword(),userControl.changeUserPassword)

module.exports = router;