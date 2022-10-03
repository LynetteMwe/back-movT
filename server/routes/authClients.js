const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const Client = require("../models/Client");
const {
    generateToken,
    getUser,
    serverError,
    comparePassword,
} = require("../utils/utils");
const methodNotAllowed = require("../middleware/methodNotAllowed");

const router = express.Router();

router.post("/login", (req, res) => {
    Client.findOne({ where: { email: req.body?.email } })
        .then(async user => {
            if (!user) {
                // No such user/email
                return res.status(400).json({
                    status: res.statusCode, // Bad Request
                    error: "Invalid credentials!", // invalid email
                });
            } else {
                const validPassword = comparePassword(
                    req.body?.password,
                    user.password
                );
                if (validPassword) {
                    // Create token if there is no token for the user
                    if (!user.token) {
                        user.token = generateToken(user.email);
                        await user.save();
                    }
                    return res.json(getUser(user, true));
                } else {
                    return res.status(400).json({
                        status: res.statusCode, // Bad Request
                        error: "Invalid credentials!", // invalid password
                    });
                }
            }
        })
        .catch(error => serverError(res, error));
});
router.all("/login", methodNotAllowed);

// Create a new user
router.post("/register", (req, res) => {
    const { username, contact, email, password } = req.body;
    Client.create({
        username,
        contact,
        email,
        password,
        token: generateToken(email),
    })
        .then(user => {
            if (!user)
                return res.status(400).json({
                    status: res.statusCode, // Bad Request
                    error: "Provide f_name, l_name, email, password",
                });
            res.json(getUser(user, true));
        })
        .catch(error => serverError(res, error));
});
router.all("/register", methodNotAllowed);

// Logout by deleting token
router.post("/logout", authenticate, (req, res) => {
    req.user
        .update({ token: null })
        .then(() => {
            res.status(200).json({
                status: res.statusCode,
                message: "Logged out successfully!",
            });
        })
        .catch(err => serverError(err));
});
router.all("/logout", methodNotAllowed);

module.exports = router;
