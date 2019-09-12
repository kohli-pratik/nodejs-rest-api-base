const mongoose = require('mongoose');
const crypto = require('crypto');
const Constants = require('../utils/constants');

const User = mongoose.model('Users');

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt)
        .update(password)
        .digest('base64');

    return `${salt}$${hash}`;
};

exports.createUser = async (req, res) => {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword(req.body.password),
            permissionLevel: (req.body.permissionLevel) ? req.body.permissionLevel : 1,
        });

        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users === []) {
            res.status(404).json({ message: 'No users stored in the database' });
        } else if (parseInt(req.jwt.permissionLevel, 10) !== Constants.permissionLevels.ADMIN) {
            res.status(403).send();
        } else {
            res.status(200).json(users);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.userId });
        if (user === null) {
            res.status(404).json({ message: `User with id ${req.params.userId} does not exist` });
        } else if (user._id.toString() !== req.jwt.userId) {
            res.status(403).send();
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = hashPassword(req.body.password);
        }
        const updatedUser = await User.findOneAndUpdate({ _id: req.params.userId },
            req.body, { new: true, useFindAndModify: false });
        if (updatedUser === null) {
            res.status(404).json({ message: `User with id ${req.params.userId} does not exist` });
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleteResult = await User.deleteOne({ _id: req.params.userId });
        if (deleteResult.deletedCount === 0) {
            res.status(404).json({ message: `User with id ${req.params.userId} does not exist` });
        } else {
            res.status(200).json({ message: `User with id ${req.params.userId} successfully deleted` });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};
