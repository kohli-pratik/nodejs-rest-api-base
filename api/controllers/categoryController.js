const mongoose = require('mongoose');

const Category = mongoose.model('Categories');

exports.createCategory = async (req, res) => {
    try {
        const newCategory = new Category({
            name: req.body.name,
        });

        const category = await newCategory.save();
        res.status(200).json(category);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (category === null) {
            res.status(404).json({ message: `Category with id ${req.params.categoryId} does not exist` });
        } else {
            res.status(200).json(category);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const deleteResult = await Category.deleteOne({ _id: req.params.categoryId });
        if (deleteResult.deletedCount === 0) {
            res.status(404).json({ message: `Category with id ${req.params.categoryId} does not exist` });
        } else {
            res.status(200).json({ message: `Category with id ${req.params.categoryId} successfully deleted` });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteAllCategories = async (req, res) => {
    try {
        const deleteOperationResult = await Category.deleteMany();
        if (deleteOperationResult.deletedCount === 0) {
            res.status(404).json({ message: 'No categories stored in the database' });
        } else {
            res.status(200).json({ message: 'All categories successfully deleted' });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};
