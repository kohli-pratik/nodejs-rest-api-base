'use strict';

const mongoose = require('mongoose');
const Category = mongoose.model('Categories');

exports.createCategory = (req, res) => {
    const newCategory = new Category({
        name: req.body.name
    });

    newCategory.save((err, category) => {
        if (err)
            res.send(err);

        res.json(category);
    });
};

exports.getAllCategories = (req, res) => {
    Category.find({}, (err, categories) => {
        if (err)
            res.send(err);

        res.json(categories);
    });
};

exports.getCategory = (req, res) => {
    Category.findById(req.params.categoryId, (err, category) => {
        if (err)
            res.send(err);

        (category === null)
            ? res.json({ message: `Category with id ${req.params.categoryId} does not exist` })
            : res.json(category);
    });
};