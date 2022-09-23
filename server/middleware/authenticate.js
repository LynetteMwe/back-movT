const User = require("../models/User");
const Session = require("../models/Session");

const authenticate = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (typeof token !== "string") {
            throw new Error("Request cookie is invalid.");
        }
        const session = await Session.findOne({ token, status: "valid" });
        if (!session) {
            res.clearCookie("token");
            throw new Error("Your session has expired. You need to log in.");
        }
        req.session = session;
        next();
    } catch (err) {
        res.status(401).json({
            errors: [
                {
                    title: "Unauthorized",
                    detail: "Authentication credentials invalid",
                    errorMessage: err.message,
                },
            ],
        });
    }
};

module.exports = { authenticate };
