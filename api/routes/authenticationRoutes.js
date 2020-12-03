const verifyUserMiddleware = require('../middlewares/verifyUserMiddleware');
const authenticationController = require('../controllers/authenticationController');

module.exports = (app) => {
    app.route('/auth')
        .post(
            verifyUserMiddleware.validateFields,
            verifyUserMiddleware.validateCredentials,
            authenticationController.authenticate,
        );
};
