'use strict';

const fs = require('fs');
const mongoose = require('mongoose'),
    Product = mongoose.model('Products');

exports.addProduct = async (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        category: (req.body.category) ? req.body.category : null,
        images: (req.files) ? [...req.files.map(file => file.path.replace('\\', '/'))] : []
    });

    try {
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        res.send(err);
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product
            .find()
            .populate('category', 'name');
        res.json(products);
    } catch (err) {
        res.send(err);
    }
}

exports.getProduct = async (req, res) => {
    try {
        const product = await Product
            .findById(req.params.productId)
            .populate('category', 'name');

        (product === null)
            ? res.json({ message: `No product with the id ${req.params.productId} exists` })
            : res.json(product);
    } catch (err) {
        res.send(err);
    }
};

exports.updateProduct = (req, res) => {
    Product.findById(req.params.productId, (err, product) => {
        if (err)
            res.send(err);
        if (product === null) {
            // Delete the temp saved product image file
            const tempStoredImages = (req.files)
                ? [...req.files.map(file => file.path.replace('\\', '/'))]
                : [];

            const deleteOperationResult = deleteFiles(tempStoredImages.map(image => `./${image}`));
            (deleteOperationResult)
                ? res.json({ message: `No product with the id ${req.params.productId} exists` })
                : res.send(deleteOperationResult);
        } else {
            req.body.images = (req.files)
                ? [...req.files.map(file => file.path.replace('\\', '/'))]
                : product.images;

            Product.findOneAndUpdate({ _id: req.params.productId }, req.body, { new: true, useFindAndModify: false }, (err, updatedProduct) => {
                if (err)
                    res.send(err);

                const deleteOperationResult = deleteFiles(product.images.map(image => `./${image}`));
                (deleteOperationResult)
                    ? res.json(updatedProduct)
                    : res.send(deleteOperationResult);
            });
        }
    });
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId)

        if (product === null) {
            res.json({ message: `No product with the id ${req.params.productId} exists` })
        } else {
            await Product.deleteOne({ _id: req.params.productId });

            // Delete product image files
            const deleteOperationResult = deleteFiles(product.images.map(image => `./${image}`));
            (deleteOperationResult)
                ? res.json({ message: `Product ${req.params.productId} successfully deleted` })
                : res.send(deleteOperationResult);
        }
    } catch (err) {
        res.send(err);
    }
};

exports.deleteAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            res.json({ message: 'No products stored in the database' })
        } else {
            await Product.deleteMany();

            // Delete all product image files
            const filePath = `./uploadedFiles`;
            const productImages = fs.readdirSync(filePath);

            const deleteOperationResult = deleteFiles(productImages.map(image => `${filePath}/${image}`));
            (deleteOperationResult)
                ? res.json({ message: `All products successfully deleted` })
                : res.send(deleteOperationResult);
        }
    } catch (err) {
        res.send(err);
    }
};

let deleteFiles = (filePaths) => {
    filePaths.forEach((filePath) => {
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            return err;
        }
    });
    return true;
}


// // Valid file type, check if file already exists
// const filePath = `./uploadedFiles/${file.originalname}`;
// fs.access(filePath, fs.F_OK, (err) => {
//     (err)
//         ? callback(null, true) // File does not exists, Accept file
//         : callback(new Error(`${file.originalname} already exists`), false); // File exists, Reject file
// });