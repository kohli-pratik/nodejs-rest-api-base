const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Constants = require('../utils/constants');

const jwtSecret = Constants.jwtSecret;
const jwtOptions = {
    expiresIn: '1h', // Numbers interpreted as seconds, String as ms unless the time unit (days, hours) is specified
};

/**
 * Salt - random data used as a password in the function that hashes data
 * HMAC - Hashed Message Authentication Code
 * Type of message authentication code that involves a hashing function and secret key
 * Used to verify the intergrity of the hashed data
 * HMAC are not decrypted, hashes are matched to determine if the hashed data is untampered
 */
exports.authenticate = async (req, res) => {
    try {
        const refreshId = `${req.body.userId}${jwtSecret}`;
        const salt = crypto.randomBytes(16).toString('base64');
        const hash = crypto.createHmac('sha512', salt).update(refreshId).digest('base64');
        req.body.refreshKey = salt;
        const token = jwt.sign(req.body, jwtSecret, jwtOptions);
        const buffer = Buffer.from(hash);
        const refreshTkn = buffer.toString('base64');
        res.status(201).json({
            accessToken: token,
            refreshToken: refreshTkn,
        });
    } catch (err) {
        res.status(500).send(err);
    }
};
