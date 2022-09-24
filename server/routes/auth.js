const express = require("express");
const User = require("../models/User");
const { generateToken, getUser, serverError } = require("../utils/utils");

const router = express.Router();

router.post("/login", (req, res) => {
    res.status(200).json("In development :)");
});

// Create a new user
router.post("/register", (req, res, next) => {
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

module.exports = router;
