const router = require('express').Router();
const MeController = require('../controllers/me.c');

router
    .route('/edit-profile')
    .get(MeController.getEditProfile)
    .post(MeController.postEditProfile);

router
    .route('/change-password')
    .get(MeController.getChangePassword)
    .post(MeController.postChangePassword);

router.get('/', MeController.profile);

module.exports = router;