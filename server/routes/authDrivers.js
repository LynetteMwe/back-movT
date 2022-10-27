const express = require("express");
const { authenticate } = require("../middleware/authenticate");
// const User = require("../models/User");
const Driver = require("../models/Driver");
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

    Driver.findOne({ where: { email: req.body?.email } })
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
    const { username, contact, email, password, vehicle_plate_no,service_type } = req.body;

    let errors = [];
    if (!req.body?.username) errors.push("Field 'username' is required!");
    if (!req.body?.contact) errors.push("Field 'contact' is required!");
    if (!req.body?.email) errors.push("Field 'email' is required!");
    if (!req.body?.password) errors.push("Field 'password' is required!");
    if (!req.body?.vehicle_plate_no) errors.push("Field 'vehicle_plate_no' is required!");
    if (!req.body?.service_type) errors.push("Field 'service_type' is required!");
    if (errors.length > 0) return res.status(400).json({ errors });

    Driver.create({
        username,
        contact,
        email,
        password,
        vehicle_plate_no,
        service_type,
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

// Logout by deleting token
// Logout by deleting token
router.post("/logout", authenticate, async (req, res) => {
    user = await Driver.findByPk(req.user.id)
      
    user.update({ token: null })
    .then(() => {
        res.status(201).json({
            status: res.statusCode,
            message: "Logged out successfully!"
        });
    })
    .catch(err => serverError(err));
});
router.all("/logout", methodNotAllowed)
 
module.exports = router;
