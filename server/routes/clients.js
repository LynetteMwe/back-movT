const express = require("express");
const ordersRoute = require("./orders");
const Client = require("../models/Client");
const { serverError, getUser, generateToken } = require("../utils/utils");
const methodNotAllowed = require("../middleware/methodNotAllowed");

const router = express.Router();

// Get single user by id
router.get("/:id(\\d+)", (req, res) => {
	Client.findByPk(req.params.id)
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

router.get("/profile", (req, res) => {
	return res.status(200).json(getUser(req.user));
});

router.post("/update-profile", (req, res) => {
	const { username, contact } = req.body;

	Client.findByPk(req.user.id)
		.then(async (client) => {
			// if client is found, update the details
			await client.update({ username, contact });

			res.status(200).json(client);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json(error);
		});
});
router.all("/update-profile", methodNotAllowed);

// Get all users
router.get("/", async (req, res) => {
	const _ = await Client.findAll();
	users = _.map((user) => getUser(user));
	res.status(200).json(users);
});

// Create a new user
router.post("/", (req, res) => {
	const { username, contact, email, password } = req.body;
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

// Update a user
// ...

// Delete a user
// ...

module.exports = router;
