const express = require("express");
const User = require("../models/User");
const { serverError, getUser, generateToken } = require("../utils/utils");

const router = express.Router();

// Get single user by id
router.get("/:pk", (req, res, next) => {
    User.findByPk(req.params.pk)
        .then(user => {
            if (!user)
                return res.status(404).json({
                    status: res.statusCode, // Not Found
                    error: "User not found!",
                });
            res.json(getUser(user));
        })
        .catch(error => serverError(res, error));
});

// Get all users
// ...

// Create a new user
router.post("/", (req, res, next) => {
    const { f_name, l_name, email, password } = req.body;
    User.create({
        f_name,
        l_name,
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

// Update a user
// ...

// Delete a user
// ...

module.exports = router;
