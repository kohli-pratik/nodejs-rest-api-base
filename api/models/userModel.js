'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: 'first name required' },
    lastName: { type: String, required: 'last name required' },
    email: { type: String, required: 'email address required' },
    password: { type: String, required: 'password required' },
    permissionLevel: { type: Number, default: 1 }
});

module.exports = mongoose.model('Users', UserSchema);