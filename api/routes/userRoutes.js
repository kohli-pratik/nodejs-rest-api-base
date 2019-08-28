'use strict';

const Constants = require('../utils/constants');

module.exports = (app) => {
    const userController = require('../controllers/userController');
    const userMiddleware = require('../middlewares/verifyUserMiddleware');
    const permissionMiddleware = require('../middlewares/verifyPermissionsMiddleware');
    const authenticationMiddleware = require('../middlewares/validateAuthMiddleware');

    app.route('/users')
        .post(userController.createUser)
        .get(
            authenticationMiddleware.validateToken,
            permissionMiddleware.verifyAccessPermissions(Constants.permissionLevels.ADMIN),
            userController.getAllUsers);

    app.route('/users/:userId')
        .get(authenticationMiddleware.validateToken,
            permissionMiddleware.verifyAccessPermissions(Constants.permissionLevels.FREE),
            userMiddleware.validateUser,
            userController.getSingleUser)
        .put(authenticationMiddleware.validateToken,
            permissionMiddleware.verifyAccessPermissions(Constants.permissionLevels.FREE),
            userMiddleware.validateUser,
            userController.updateUser)
        .delete(authenticationMiddleware.validateToken,
            permissionMiddleware.verifyAccessPermissions(Constants.permissionLevels.ADMIN),
            userMiddleware.validateUser,
            userController.deleteUser);
};