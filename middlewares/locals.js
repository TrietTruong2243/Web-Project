module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.isAuthenticated = true;
        res.locals.authUser = req.user;
    }
    next();
};