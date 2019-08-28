'use strict';

const jwt = require('jsonwebtoken'),
    Constants = require('../utils/constants'),
    jwtSecret = Constants.jwtSecret;

exports.validateToken = (req, res, next) => {
    if (!req.headers || !req.headers['authorization']) {
        res.status(401).send();
    }

    try {
        const authorization = req.headers['authorization'].split(' ');
        if (authorization[0] === 'Bearer') {
            req.jwt = jwt.verify(authorization[1], jwtSecret);
            return next();
        } else {
            res.status(401).send();
        }
    } catch (err) {
        res.status(403).send(err);
    }
}