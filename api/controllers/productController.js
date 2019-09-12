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
        res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product
            .findById(req.params.productId)
            .populate('category', 'name');

        (product === null)
            ? res.status(404).json({ message: `No product with the id ${req.params.productId} exists` })
            : res.status(200).json(product);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product
            .find()
            .populate('category', 'name');
        res.status(200).json(products);
    } catch (err) {
        res.status(500).send(err);
    }
}

exports.getAllProductsFiltered = async (req, res) => {
    try {
        const { filterName } = req.body;
        let conditions = {};

        switch (filterName) {
            case 'category':
                conditions = { $or: req.body.categories.split(',').map(category => { return { [filterName]: category } }) };
                break;
            case 'price':
                const minPrice = (req.body.minPrice) ? parseFloat(req.body.minPrice) : 0;
                const maxPrice = (req.body.maxPrice) ? parseFloat(req.body.maxPrice) : 0;
                conditions = { price: { $lt: maxPrice, $gt: minPrice } };
                break;
        }
        const filteredProducts = await Product.find(conditions);
        res.status(200).json(filteredProducts);
    } catch (err) {
        console.log('TEST', err);
        res.status(500).send(err);
    }
};

exports.getAllProductsSorted = async (req, res) => {
    try {
        const { sortName } = req.body;
        let sortedProducts = {};
        switch (sortName) {
            case 'price-asc':
                sortedProducts = await Product.find({}).sort('price');
                break;
            case 'price-desc':
                sortedProducts = await Product.find({}).sort('-price');
                break;
            default:
                sortedProducts = await Product.find({});
                break;
        }
        res.status(200).json(sortedProducts);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const currentProduct = await Product.findById(req.params.productId);

        if (currentProduct === null) {
            // Delete the temp saved product image file
            const tempStoredImages = (req.files)
                ? [...req.files.map(file => file.path.replace('\\', '/'))]
                : [];

            const deleteOperationResult = deleteFiles(tempStoredImages.map(image => `./${image}`));
            (deleteOperationResult)
                ? res.status(404).json({ message: `No product with the id ${req.params.productId} exists` })
                : res.status(500).send(deleteOperationResult);
        } else {
            req.body.images = (req.files)
                ? [...req.files.map(file => file.path.replace('\\', '/'))]
                : currentProduct.images;

            const updatedProduct = await Product.findOneAndUpdate({ _id: req.params.productId }, req.body, { new: true, useFindAndModify: false });
            const deleteOperationResult = deleteFiles(currentProduct.images.map(image => `./${image}`));
            (deleteOperationResult)
                ? res.status(200).json(updatedProduct)
                : res.status(500).send(deleteOperationResult);
        }
    } catch (err) {
        res.send(err);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (product === null) {
            res.status(404).json({ message: `No product with the id ${req.params.productId} exists` });
        } else {
            await Product.deleteOne({ _id: req.params.productId });
            // Delete product image files
            const deleteFileResult = await deleteFiles(product.images.map(image => `./${image}`));
            (deleteFileResult)
                ? res.status(200).json({ message: `Product ${req.params.productId} successfully deleted` })
                : res.status(500).send(deleteFileResult);
        }

    } catch (err) {
        res.send(err);
    }
};

exports.deleteAllProducts = async (req, res) => {
    try {
        const deleteOperationResult = await Product.deleteMany();
        if (deleteOperationResult.deletedCount === 0) {
            res.status(404).json({ message: 'No products stored in the database' })
        } else {
            // Delete all product image files
            const filePath = `./uploadedFiles`;
            const productImages = fs.readdirSync(filePath);

            const deleteFilesResult = await deleteFiles(productImages.map(image => `${filePath}/${image}`));
            (deleteFilesResult)
                ? res.status(200).json({ message: 'All products successfully deleted' })
                : res.status(500).send(deleteFilesResult);
        }
    } catch (err) {
        res.send(err);
    }
};

const deleteFiles = async (filePaths) => {
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