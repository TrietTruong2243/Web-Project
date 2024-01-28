const authRoute = require('express').Router();
const authController = require('../controllers/auth.c');
require('../middleware/passport.middleware');

authRoute.get('/login', authController.getLogin);
authRoute.get('/logout', authController.getLogout);

authRoute.post('/login', authController.postLogin);
authRoute.post('/create-password/:username', authController.postCreatePassword);

module.exports = authRoute;
