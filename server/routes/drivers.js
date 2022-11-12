const express = require("express");
const { authenticateDriver } = require("../middleware/authenticate");
const Driver = require("../models/Driver");
const { serverError, getUser, generateToken } = require("../utils/utils");

const router = express.Router();

// Get single user by id
router.get("/:id(\\d+)", (req, res, next) => {
	Driver.findByPk(req.params.id)
		.then((user) => {
			if (!user)
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "User not found!",
				});
			res.json(getUser(user));
		})
		.catch((error) => serverError(res, error));
});

// Get single user by id
router.get("/profile", (req, res, next) => {
	const driver = {
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		contact: req.user.contact,
		carType: req.user.carType,
		vehicle_plate_no: req.user.vehicle_plate_no,
		type: req.user.type,
	};
	return res.status(200).json(driver);
});

// Get all users
router.get("/", async (req, res) => {
	const _ = await Driver.findAll();
	users = _.map((user) => getUser(user));
	res.status(200).json(users);
});

// Create a new user
router.post("/", (req, res, next) => {
	const { username, contact, email, password } = req.body;
	Driver.create({
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

// Update a user
// ...

// Delete a user
// ...

module.exports = router;
