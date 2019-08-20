'use strict';
module.exports = (app) => {
    var uploadController = require('../controllers/uploadController');
    var productController = require('../controllers/productController');

    app.route('/product')
        .post(uploadController.upload.single('productImage'), productController.addProduct)

    // app.route('/product/:productName')
    //     .get(productController.downloadproduct)
    //     .put(productController.updateproduct)
    //     .delete(productController.deleteproduct)
}