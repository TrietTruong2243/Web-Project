require("dotenv").config();
const app = require('express');
const router = app.Router();
const mws = require("../../mws/Client/middlewareController")
const userControl = require("../../controllers/Client/user.c");
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
       

    ];
};
let validateUserPassword = () => {
    return [
        check('password', 'Password must have at least 1 uppercase, 1 lowercase and 1 special characters').matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
          ),
        check('password', 'Password length must more thanh 6!').isLength({ min: 6 }),
        check('password', 'Password must not empty!').not().isEmpty(),
        check('password_confirm', 'Password must have at least 1 uppercase, 1 lowercase and 1 special characters!').custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {
                // trow error if passwords do not match
                throw new Error("Password must have at least 1 uppercase, 1 lowercase and 1 special characters!");
            } else {
                return value;
            }
        }),
        check('password_confirm', 'Confirm password length must more than 6! ').isLength({ min: 6 }),
        check('password_confirm', 'Confirm password must not empty!').not().isEmpty(),
        check('current_password', 'Current password must have at least 1 uppercase, 1 lowercase and 1 special characters').matches(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
          ),
        check('current_password', 'Current password length must more than 6! ').isLength({ min: 6 }),
        check('current_password', 'Current password must not empty!').not().isEmpty(),

    ];
};
let validateGGUserInfo = () => {
    return [
        check('name', 'Invalid username!').isAlphanumeric(),
        check('name', 'Name must not empty!').not().isEmpty(),
        check('username', 'Username length must more than 6!').isLength({min: 6}),
        check('username', 'Username must not empty!').not().isEmpty(),
        check('email_address', 'Invalid email!').isEmail(),
        check('email_address', 'Email must not empty').not().isEmpty(),
        check('phone_number', 'Phonenumber must have 10 numbers!').isLength({mix:10,max: 10}),
        check('phone_number', 'Phonenumber must be number!').isNumeric(),
        check('phone_number', 'Phonenumber must not empty!').not().isEmpty(),
        check('home_address', 'Address must not empty!').not().isEmpty(),
    
    ];
}
router.get("/accountsettings",mws.verifyToken, userControl.accountsettings)
router.get("/accountorders",mws.verifyToken, userControl.accountorders)
router.post("/changeuserinfo",mws.verifyToken,validateUserInfo(),userControl.changeUserInfo)
router.post("/changegguserinfo",mws.verifyToken,validateGGUserInfo(),userControl.changeGGUserInfo)
router.post("/addgguserinfo",validateGGUserInfo(),userControl.addGGUserInfo)
router.post("/changeuserpassword",mws.verifyToken, validateUserPassword(),userControl.changeUserPassword)

module.exports = router;