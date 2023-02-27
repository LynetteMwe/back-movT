const express = require("express");
const methodNotAllowed = require("../middleware/methodNotAllowed");
const {
	clientForgotPw,
	createClient,
	clientLogin,
	clientLogout,
} = require("../controllers/AuthController");

const router = express.Router();

router.post("/login", clientLogin);

router.all("/login", methodNotAllowed);

// Create a new user
router.post("/register", createClient);

router.all("/register", methodNotAllowed);

router.post("/forgot-password", clientForgotPw);

router.all("/forgot-password", methodNotAllowed);

// Logout by deleting token
router.post("/logout", clientLogout);

router.all("/logout", methodNotAllowed);

module.exports = router;
