'use strict';

module.exports = (app) => {
    const categoryController = require('../controllers/categoryController');

    app.route('/categories')
        .post(categoryController.createCategory)
        .get(categoryController.getAllCategories);

    app.route('/categories/:categoryId')
        .get(categoryController.getCategory);
};