'use strict';
module.exports = (app) => {
    var uploadController = require('../controllers/uploadController');
    var productController = require('../controllers/productController');

    app.route('/products')
        .post(uploadController.upload.single('productImage'), productController.addProduct)
        .get(productController.getAllProducts)
        .delete(productController.deleteAllProducts);

    app.route('/products/:productId')
        .get(productController.getProduct)
        .put(uploadController.upload.single('updatedProductImage'), productController.updateProduct)
        .delete(productController.deleteProduct);
}