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
		.then(async (user) => {
			if (!user) {
				// No such user/email
				return res.status(400).json({
					status: res.statusCode, // Bad Request
					error: "Invalid email!", // invalid email
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
		.catch((error) => serverError(res, error));
});
router.all("/login", methodNotAllowed);

// Create a new user
router.post("/register", (req, res) => {
	const { username, contact, email, password } = req.body;

	let errors = [];
	const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
	const usernameRegex = /^[a-zA-Z0-9]+$/;
	const numberOnly = !isNaN(username);

	if (!username) errors.push("Field 'username' is required!");
	if (!contact) errors.push("Field 'contact' is required!");
	if (!email) errors.push("Field 'email' is required!");
	if (!password) errors.push("Field 'password' is required!");
	if (!pwRegex.test(password))
		errors.push(
			"Password must be at least 8 characters, including one digit, one lower case, one upper case character."
		);
	if (username.length < 3 || username.length > 15)
		errors.push(
			"Username must be at least 3 and at most 15 characters long."
		);

	if (!usernameRegex.test(username))
		errors.push("Username can contain letters and numbers only!");
	if (numberOnly) errors.push("Username cannot contain numbers only!");

	if (errors.length > 0) return res.status(400).json({ errors });

	Client.create({
		username,
		contact,
		email,
		password,
		token: generateToken(email),
	})
		.then((user) => {
			if (!user)
				return res.status(400).json({
					status: res.statusCode, // Bad Request
					error: "Provide username, contact, email, password",
				});
			res.json(getUser(user, true));
		})
		.catch((error) => serverError(res, error));
});
router.all("/register", methodNotAllowed);

router.post("/forgot-password", (req, res) => {
	const { email, password } = req.body;
	const errors = [];
	//at least 1 digit, one lower case, one upper case, 8 characters
	const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

	if (!email) errors.push("Field 'email' is required!");
	if (!password) errors.push("Field 'password' is required!");
	if (!pwRegex.test(password))
		errors.push(
			"Password must be at least 8 characters, including one digit, one lower case, one upper case character."
		);

	if (errors.length > 0) return res.status(400).json({ errors });

	Client.update({ password }, { where: { email } })
		.then((client) => {
			res.json({
				message: "Password changed successfully",
			});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json(error);
		});
});
router.all("/forgot-password", methodNotAllowed);

// Logout by deleting token
router.post("/logout", authenticate, async (req, res) => {
	user = await Client.findByPk(req.user.id);

	user.update({ token: null })
		.then(() => {
			res.status(201).json({
				status: res.statusCode,
				message: "Logged out successfully!",
			});
		})
		.catch((err) => serverError(err));
});
router.all("/logout", methodNotAllowed);

module.exports = router;
