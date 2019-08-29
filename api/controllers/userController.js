'use strict';

const mongoose = require('mongoose'),
    User = mongoose.model('Users'),
    crypto = require('crypto'),
    Constants = require('../utils/constants');

exports.createUser = async (req, res) => {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword(req.body.password),
            permissionLevel: (req.body.permissionLevel) ? req.body.permissionLevel : 1
        });

        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.send(err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        (users === [])
            ? res.status(404).json({ message: `No users stored in the database` })
            : res.json(users);
    } catch (err) {
        res.send(err);
    }
};

exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userId });
        (user === null)
            ? res.status(404).json({ message: `User with id ${req.params.userId} does not exist` })
            : (user._id !== req.jwt.userId && parseInt(req.jwt.permissionLevel) !== Constants.permissionLevels.ADMIN)
                ? res.status(403).send()
                : res.json(user);
    } catch (err) {
        res.send(err);
    }
};

exports.updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = hashPassword(req.body.password);
        }
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, useFindAndModify: false });
        if (updatedUser === null) {
            res.status(404).json({ message: `User with id ${req.params.userId} does not exist` });
        } else {
            res.json(updatedUser);
        }
    } catch (err) {
        res.send(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleteResult = await User.deleteOne({ _id: req.params.userId });
        (deleteResult.deletedCount === 0)
            ? res.status(404).json({ message: `User with id ${req.params.userId} does not exist` })
            : res.json({ message: `User with id ${req.params.userId} successfully deleted` });
    } catch (err) {
        res.send(err);
    }
};

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt)
        .update(password)
        .digest('base64');

    return `${salt}$${hash}`;
}
