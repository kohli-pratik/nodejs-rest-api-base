const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { type: String, required: 'Kindly enter the name of the category' },
});

module.exports = mongoose.model('Categories', CategorySchema);
