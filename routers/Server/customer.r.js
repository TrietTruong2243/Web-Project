const router = require('express').Router();
const UserController = require('../../controllers/Server/user.c.js');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
});

router.get('/create-new', UserController.getCreateUser);
router.post('/multi-action', UserController.handleMultiItems);
router.get('/edit/:id', UserController.getEditUser);
router.post('/edit/:id', upload.single('image'), UserController.postEditUser);
router.post('/:id', UserController.handleSingleItem);
router.get('/', UserController.showAll('customer'));
router.post('/', upload.single('image'), UserController.createUser);

// api
router.get('/check-username/:username', UserController.checkUsername);

module.exports = router;