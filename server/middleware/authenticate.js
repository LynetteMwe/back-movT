const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("../models/User");

passport.use(
    new BearerStrategy(function (token, done) {
        User.findOne({ where: { token: token } })
            .then(user => {
                if (!user) return done(null, false);
                return done(null, user, { scope: "all" });
            })
            .catch(err => {
                if (err) return done(err);
            });
    })
);

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

module.exports = { authenticate, passport };
