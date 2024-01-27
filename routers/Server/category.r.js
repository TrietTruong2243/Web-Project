const router  = require('express').Router();
const CategoryController = require('../../controllers/Server/category.c.js');

router.get('/create-new', CategoryController.getCreateCategory);
router.post('/multi-action', CategoryController.handleMultiItems);
router.get('/edit/:id', CategoryController.getEditCategory);
router.post('/edit/:id', CategoryController.postEditCategory);
router.post('/:id', CategoryController.handleSingleItem);
router.get('/', CategoryController.showAll);
router.post('/', CategoryController.createCategory);

module.exports = router;