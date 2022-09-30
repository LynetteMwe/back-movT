const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const Driver = require("../models/Driver");
const { getUser } = require("../utils/utils");

passport.use(
    new BearerStrategy(function (token, done) {
        // Driver.findAll().then(usrs => {
        //     users = usrs.map(user => getUser(user, true));
        //     console.log(users);
        // }).catch(console.log)
        Driver.findOne({ where: { token: token } })
            .then(user => {
                if (!user) return done(null, false);
                return done(null, user, { scope: "all" });
            })
            .catch(err => {
                if (err) return done(err);
            });
    })
);

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

            req.user = user;
            next();
        }
    )(req, res, next);
}
 

module.exports = { authenticateDriver, passport };
