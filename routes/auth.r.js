const router = require('express').Router();
const AuthController = require('../controllers/auth.c');
const AuthMiddleware = require('../middlewares/auth');

router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/', AuthMiddleware, (req, res) => {
    res.render('dashboard', {
        active: { Dashboard: true },
        user: req.user
    });
});

module.exports = router;