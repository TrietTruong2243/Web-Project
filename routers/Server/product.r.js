const router = require('express').Router();
const ProductController = require('../../controllers/Server/product.c.js');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
});
router.get('/create-new', ProductController.getCreateProduct);
router.post('/multi-action', ProductController.handleMultiItems);
router.get('/edit/:id', ProductController.getEditProduct);
router.post('/edit/:id', upload.array('allImages', 10), ProductController.postEditProduct);
router.post('/:id', ProductController.handleSingleItem);
router.get('/', ProductController.showAll);
router.post('/', upload.array('allImages', 10),ProductController.createProduct);
// api
router.get('/api/data/:id', ProductController.getProductData);
router.get('/api/data', ProductController.getAllProducts);

module.exports = router;