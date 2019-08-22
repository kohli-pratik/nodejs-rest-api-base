'use strict';

const mongoose = require('mongoose');
const Category = mongoose.model('Categories');

exports.createCategory = async (req, res) => {
    try {
        const newCategory = new Category({
            name: req.body.name
        });

        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        res.send(err);
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (err) {
        res.send(err);
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        (category === null)
            ? res.json({ message: `Category with id ${req.params.categoryId} does not exist` })
            : res.json(category);

    } catch (err) {
        res.send(err);
    }
};