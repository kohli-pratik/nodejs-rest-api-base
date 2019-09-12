const mongoose = require('mongoose');
const crypto = require('crypto');
const Constants = require('../utils/constants');

const User = mongoose.model('Users');

exports.validateFields = (req, res, next) => {
    if (!req.body.email && !req.body.password) {
        return res.status(400).json({ message: 'Missing email and password fields' });
    }

    if (!req.body.email) {
        return res.status(400).json({ message: 'Missing email field' });
    }

    if (!req.body.password) {
        return res.status(400).json({ message: 'Missing password field' });
    }

    return next();
};

exports.validateCredentials = async (req, res, next) => {
    try {
        const user = await User.find({ email: req.body.email });

        if (user[0] === null) {
            res.status(404).json({ message: `No user found with email - ${req.body.email}` });
        } else {
            const password = user[0].password.split('$');
            const salt = password[0];
            const hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
            if (hash !== password[1]) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            req.body = {
                userId: user[0]._id,
                email: user[0].email,
                permissionLevel: user[0].permissionLevel,
                provider: 'email',
                name: `${user[0].firstName} ${user[0].lastName}`,
            };
            return next();
        }
    } catch (err) {
        res.status(500).json({ message: 'Error validating credentials' });
    }
    return false;
};

exports.validateUser = async (req, res, next) => {
    try {
        const user = await User.find({ _id: req.body.userId });

        if (user[0] === null) {
            res.status(404).json({ message: `No user found with id - ${req.body.userId}` });
        } else if (user._id !== req.body.userId
            && parseInt(req.jwt.permissionLevel, 10) !== Constants.permissionLevels.ADMIN) {
            return res.status(403).send();
        } else {
            return next();
        }
    } catch (err) {
        res.status(500).json({ message: 'Error validating user' });
    }
    return false;
};
