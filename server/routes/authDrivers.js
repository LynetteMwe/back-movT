const express = require("express");
const { authenticateDriver } = require("../middleware/authenticate");
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
	const {
		username,
		contact,
		email,
		password,
		vehicle_plate_no,
		carType,
		type,
	} = req.body;

	const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
	const usernameRegex = /^[a-zA-Z0-9]+$/;
	const numberOnly = !isNaN(username);

	let errors = [];
	if (!req.body?.username) errors.push("Field 'username' is required!");
	if (!req.body?.contact) errors.push("Field 'contact' is required!");
	if (!req.body?.email) errors.push("Field 'email' is required!");
	if (!req.body?.password) errors.push("Field 'password' is required!");
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
	if (numberOnly) errors.push("Username cannot be a number only!");

	if (errors.length > 0) return res.status(400).json({ errors });

	Driver.create({
		username,
		contact,
		email,
		password,
		vehicle_plate_no,
		carType,
		type,
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

router.post("/setup-vehicle-info", authenticateDriver, (req, res) => {
	const { vehicle_plate_no, carType, type } = req.body;
	const driver_id = req.user.id;

	let errors = [];
	if (!vehicle_plate_no) errors.push("Field 'vehicle_plate_no' is required!");
	if (!carType) errors.push("Field 'carType' is required!");
	if (!type) errors.push("Field 'type' is required!");

	if (errors.length > 0) return res.status(400).json({ errors });

	Driver.update(
		{ vehicle_plate_no, carType, type },
		{ where: { id: driver_id } }
	)
		.then((driver) => {
			res.json({
				// status: res.statusCode,
				message: "Vehicle info updated successfully!",
			});
		})
		.catch((error) => {
			res.status(500).json(error);
		});
});
router.all("/register", methodNotAllowed);

// Logout by deleting token
router.post("/logout", async (req, res) => {
	user = await Driver.findByPk(req.user.id);

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
