const jwt = require("jsonwebtoken");
const userDB = require("../db/db_user_helpers")
require('dotenv').config();
const middlewareController = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;
        if (token) {
            const accessToken = token;
            jwt.verify(accessToken,process.env.SECRET_KEY, (err, user) => {
                if (err) {
                    res.clearCookie('token')
                    // res.status(403).json("Token is not valid");
                    res.redirect('/auth/signin')
                }
                else{
                    req.user = user;
                    return next();
                    
                }
                

            });
        }
        else
        {
            res.redirect('/auth/signin')
           // res.status(481).json("You're not authenticated");
        }
         
        

    },
 
    viewProductWithUser: (req, res, next) => {

        const token = req.cookies.token;
        if (token) {
            const accessToken = token;
            jwt.verify(accessToken,process.env.SECRET_KEY, (err, user) => {
                if (err) {
                    res.clearCookie('token')
                    // res.status(403).json("Token is not valid");
                    return next();

                }
                else{
                    req.user = user;
                    return next();
                    
                }
                

            });
        }
        else
        {
            return next();

        }
         
        

    },
   


}
module.exports = middlewareController;