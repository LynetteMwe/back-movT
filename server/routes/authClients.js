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
    let errors = [];
    if (!req.body?.email) errors.push("Field 'email' is required!");
    if (!req.body?.password) errors.push("Field 'password' is required!");
    if (errors.length > 0) return res.status(400).json({ errors });

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
    // longer than 8 characters, must have at least one uppercase, one lowercase and one character
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    let errors = [];
    if (!req.body?.username) errors.push("Field 'username' is required!");
    if (!req.body?.contact) errors.push("Field 'contact' is required!");
    if (!req.body?.email) errors.push("Field 'email' is required!");
    if (!req.body?.password) errors.push("Field 'password' is required!");
    if (req.body.password !== '' && password.match(pwRegex)) errors.push("Password requirements not met")
    
    if (errors.length > 0) return res.status(400).json({ errors });

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
                    error: "Provide username, contact, email, password",
                });
            res.json(getUser(user, true));
        })
        .catch(error => serverError(res, error));
});
router.all("/register", methodNotAllowed);

router.put("/changepassword"),
    (req, res) => {
        Client.findOne({ where: { email: req.body?.email } }).then(
            async user => {
                if (!user) {
                    // No such user/email
                    return res.status(400).json({
                        status: res.statusCode, // Bad Request
                        error: "Invalid email!",
                    });
                } else {
                    req.user
                        .update({ password: req.body?.password })
                        .then(() => {
                            res.status(200).json({
                                status: res.statusCode,
                                message: "Password changed",
                            });
                        })
                        .catch(err => serverError(err));
                }
            }
        );
    };
router.all("/changepassword", methodNotAllowed);

// Logout by deleting token
router.post("/logout", authenticate, async (req, res) => {
    user = await Client.findByPk(req.user.id)
    
    user.update({ token: null })
    .then(() => {
        res.status(201).json({
            status: res.statusCode,
            message: "Logged out successfully!"
        });
    })
    .catch(err => serverError(err));
});
router.all("/logout", methodNotAllowed);

module.exports = router;
