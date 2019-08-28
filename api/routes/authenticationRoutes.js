'use strict';

module.exports = (app) => {
    const verifyUserMiddleware = require('../middlewares/verifyUserMiddleware');
    const authenticationController = require('../controllers/authenticationController');

    app.route('/auth')
        .post(
            verifyUserMiddleware.validateFields,
            verifyUserMiddleware.validateCredentials,
            authenticationController.authenticate
        );
};