const categoryController = require('../controllers/categoryController');

module.exports = (app) => {
    app.route('/categories')
        .post(categoryController.createCategory)
        .get(categoryController.getAllCategories)
        .delete(categoryController.deleteAllCategories);

    app.route('/categories/:categoryId')
        .get(categoryController.getCategory)
        .delete(categoryController.deleteCategory);
};
