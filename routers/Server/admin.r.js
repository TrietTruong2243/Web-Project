const router = require('express').Router();
const UserController = require('../../controllers/Server/user.c.js');

router.post('/multi-action', UserController.handleMultiItems);
router.post('/:id', UserController.handleSingleItem);
router.get('/', UserController.showAll('admin'));

module.exports = router;