const jwt = require('jsonwebtoken');
const Constants = require('../utils/constants');

const jwtSecret = Constants.jwtSecret;

exports.validateToken = (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
        res.status(401).send();
    } else {
        try {
            const authorization = req.headers.authorization.split(' ');
            if (authorization[0] === 'Bearer') {
                req.jwt = jwt.verify(authorization[1], jwtSecret);
                return next();
            }
            res.status(401).send();
        } catch (err) {
            res.status(403).send(err);
        }
    }
    return false;
};
