'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: 'Kindly enter the name of the product' },
    price: { type: Number, required: 'Kindly enter the price of the product' },
    image: { type: String, required: false },
})

module.exports = mongoose.model('Products', ProductSchema);