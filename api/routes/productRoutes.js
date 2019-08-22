'use strict';

module.exports = (app) => {
    const uploadController = require('../controllers/uploadController');
    const productController = require('../controllers/productController');

    app.route('/products')
        .post(uploadController.upload.array('productImage'), productController.addProduct)
        .get(productController.getAllProducts)
        .delete(productController.deleteAllProducts);

    app.route('/products/single/:productId')
        .get(productController.getProduct)
        .put(uploadController.upload.array('updatedProductImage'), productController.updateProduct)
        .delete(productController.deleteProduct);

    app.route('/products/filtered')
        .get(productController.getAllProductsFiltered);

    app.route('/products/sorted')
        .get(productController.getAllProductsSorted);
}