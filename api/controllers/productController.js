'use strict';

const fs = require('fs');
const mongoose = require('mongoose'),
    Product = mongoose.model('Products');

exports.addProduct = (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        image: (req.file) ? req.file.path.replace('\\', '/') : null
    });

    newProduct.save((err, product) => {
        if (err)
            res.send(err);
        res.json(product);
    });
};

exports.getAllProducts = (req, res) => {
    Product.find({}, (err, products) => {
        if (err)
            res.send(err);
        res.json(products);
    })
};

exports.getProduct = (req, res) => {
    Product.findById(req.params.productId, (err, product) => {
        if (err)
            res.send(err);
        (product === null)
            ? res.json({ message: `No product with the id ${req.params.productId} exists` })
            : res.json(product);
    })
};

exports.updateProduct = (req, res) => {
    Product.findByIdAndUpdate({ _id: req.params.productId }, (err, products) => {
        if (err)
            res.send(err);
        res.json(products);
    })
};

exports.deleteProduct = (req, res) => {
    Product.findById(req.params.productId, (err, product) => {
        if (err)
            res.send(err);
        if (product === null) {
            res.json({ message: `No product with the id ${req.params.productId} exists` })
        } else {
            Product.deleteOne({ _id: req.params.productId }, (err, operation) => {
                if (err)
                    res.send(err);

                // Delet product image file
                const filePath = `./${product.image}`;
                try {
                    fs.unlinkSync(filePath);
                    res.json({ message: `Product ${req.params.productId} successfully deleted` });
                } catch (err) {
                    res.send(err);
                }
            })
        }
    })
};

exports.deleteAllProducts = (req, res) => {
    Product.find({}, (err, products) => {
        if (err)
            res.send(err);
        if (products.length === 0) {
            res.json({ message: 'No products stored in the database' })
        } else {
            Product.deleteMany({}, (err, operation) => {
                if (err)
                    res.send(err);

                // Delet all product image files
                const filePath = `./uploadedFiles`;
                const productImages = fs.readdirSync(filePath);
                try {
                    productImages.forEach((image) => {
                        fs.unlinkSync(`${filePath}/${image}`);
                    });
                    res.json({ message: `All products successfully deleted` });
                } catch (err) {
                    res.send(err);
                }
            })
        }
    });
};