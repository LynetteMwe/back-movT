const express = require("express");
const methodNotAllowed = require("../middleware/methodNotAllowed");
const {
	getDriverByID,
	getDriverProfile,
	updateDriverProfile,
	getDrivers,
	createDriver,
} = require("../controllers/DriversController");

const router = express.Router();

// Get all drivers
router.get("/", getDrivers);

// Get single user by id
router.get("/:id(\\d+)", getDriverByID);

// Get single user by id
router.get("/profile", getDriverProfile);

// Create a new driver
router.post("/", createDriver);

// Update driver's profile
router.post("/update-profile", updateDriverProfile);
router.all("/update-profile", methodNotAllowed);

// Delete a driver

module.exports = router;
