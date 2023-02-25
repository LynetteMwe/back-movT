const express = require("express");
const methodNotAllowed = require("../middleware/methodNotAllowed");
const {
	getClients,
	getClient,
	getClientProfile,
	registerClient,
	updateClientProfile,
} = require("../controllers/ClientsController.js");

const router = express.Router();

// Get all clients
router.get("/", getClients);

// Get single user by id
router.get("/:id(\\d+)", getClient);

// Get user's profile
router.get("/profile", getClientProfile);

// Create a new client
router.post("/", registerClient);

// Update client's profile
router.post("/update-profile", updateClientProfile);
router.all("/update-profile", methodNotAllowed);

// Update a user
// ...

// Delete a user
// ...

module.exports = router;
