'use strict';

const mongoose = require('mongoose'),
    Product = mongoose.model('Products');

exports.addProduct = (req, res) => {
    console.log('IMAGE', req.file);
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        image: (req.file) ? req.file.path : null
    });

    newProduct.save((err, product) => {
        if (err)
            res.send(err);
        res.json(product);
    });
};