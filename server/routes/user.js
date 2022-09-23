const express = require("express");
const User = require("../models/User");
const { serverError, getUser } = require("../utils/utils");

const router = express.Router();

// Get single user by id
router.get("/user/:pk", (req, res, next) => {
    User.findByPk(req.params.pk)
        .then(user => {
            if (!user)
                return res.json({
                    status: 404, // Not Found
                    error: "User not found!",
                });
            return res.json(getUser(user));
        })
        .catch(error => serverError(res, error));
});

// Get all users
// ...

// Create a new user
router.post("/user", (req, res, next) => {
    const { f_name, l_name, email, password } = req.body;
    User.create({
        f_name,
        l_name,
        email,
        password,
    })
        .then(user => {
            if (!user)
                return res.json({
                    status: 400, // Bad Request
                    error: "Provide f_name, l_name, email, password",
                });
            return res.json(getUser(user));
        })
        .catch(error => serverError(res, error));
});

// Update a user
// ...

// Delete a user
// ...

module.exports = router;
