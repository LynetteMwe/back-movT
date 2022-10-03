const passport = require("passport");

// Middleware to only allow authenticated clients to access the route
function authenticateClient(req, res, next) {
    passport.authenticate(
        "bearer",
        { session: false },
        function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({
                    status: res.statusCode,
                    message: "Incorrect token credentials",
                });
            }

            // if the user is not a client, return error response
            if (info?.driver) {
                return res.status(401).json({
                    status: res.statusCode,
                    message: "Only clients are allowed to access this route!",
                });
            }

            req.user = user;
            next();
        }
    )(req, res, next);
}

// Middleware to only allow authenticated drivers to access the route
function authenticateDriver(req, res, next) {
    passport.authenticate(
        "bearer",
        { session: false },
        function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({
                    status: res.statusCode,
                    message: "Incorrect token credentials",
                });
            }

            // if the user is not a driver, return error response
            if (info?.client) {
                return res.status(401).json({
                    status: res.statusCode,
                    message: "Only drivers are allowed to access this route!",
                });
            }

            req.user = user;
            next();
        }
    )(req, res, next);
}

// Middleware to only allow anyone authenticated to access the route
function authenticate(req, res, next) {
    passport.authenticate(
        "bearer",
        { session: false },
        function (err, user, info) {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(401).json({
                    status: res.statusCode,
                    message: "Incorrect token credentials",
                });
            }

            req.user = user;
            next();
        }
    )(req, res, next);
}

module.exports = { authenticateClient, authenticateDriver, authenticate };
