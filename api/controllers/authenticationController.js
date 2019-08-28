'use strict';

const jwt = require('jsonwebtoken'),
    crypto = require('crypto'),
    Constants = require('../utils/constants'),
    jwtSecret = Constants.jwtSecret;

exports.authenticate = async (req, res) => {
    try {
        const refreshId = `${req.body.userId}${jwtSecret}`;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let buffer = new Buffer(hash);
        let refreshTkn = buffer.toString('base64');
        res.status(201).json({
            accessToken: token,
            refreshToken: refreshTkn
        });
    } catch (err) {
        res.status(500).send(err);
    }
};