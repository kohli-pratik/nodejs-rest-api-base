'use strict';

exports.verifyAccessPermissions = (requiredPermissionLevel) => {
    return (req, res, next) => {
        const userPermissionLevel = parseInt(req.jwt.permissionLevel);
        if (requiredPermissionLevel <= userPermissionLevel) {
            return next();
        } else {
            res.status(403).send();
        }
    };
}