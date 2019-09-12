exports.verifyAccessPermissions = (requiredPermissionLevel) => (req, res, next) => {
    const userPermissionLevel = parseInt(req.jwt.permissionLevel, 10);
    if (requiredPermissionLevel <= userPermissionLevel) {
        return next();
    }
    res.status(403).send();
    return false;
};
