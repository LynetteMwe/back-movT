const express = require("express");
const Order = require("../models/Order");
const moment = require("moment");
const {
	authenticateDriver,
	authenticateClient,
} = require("../middleware/authenticate");
const {
	sendNotificationToDriver,
	sendNotificationToClient,
} = require("../services/notifications");
const { getOrder } = require("../utils/utils");
const {
	getOrders,
	createOrder,
	getDriversOrders,
	getClientsOrders,
	acceptOrder,
	placedOrdersAccToDriver,
	pickOrder,
	deliverOrder,
	getDeliveredOrdersByDriver,
	getOrderById,
	cancelOrder,
} = require("../controllers/OrdersController");

const router = express.Router();

const serverError = (res, error) => {
	if (error?.original?.code === "ER_NO_REFERENCED_ROW_2") {
		res.statusCode =
			error?.original?.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500;

		let errors = [];
		if (res.statusCode === 400)
			errors.push("Client and Driver ID must be of existing users");
		if (errors.length > 0) return res.status(400).json({ errors });
	}

	if (error?.original?.code === "ER_DUP_ENTRY") {
		res.statusCode = error?.original?.code === "ER_DUP_ENTRY" ? 400 : 500;

		let errors = [];
		if (res.statusCode === 400) errors.push("That order already exists");
		if (errors.length > 0) return res.status(400).json({ errors });
	}
};

// Get all orders
router.get("/", getOrders);

router.get("/:order_id(\\d+)", getOrderById);

// get all orders per client
router.get("/clients/:ClientId(\\d+)", authenticateClient, getClientsOrders);
// get all orders per Driver
router.get(
	"/drivers/:DriverId(\\d+)",
	authenticateDriver,
	getDeliveredOrdersByDriver
);

// get all orders per driver
router.get("/drivers/:DriverId(\\d+)", authenticateDriver, getDriversOrders);

router.get("/placed", authenticateDriver, placedOrdersAccToDriver);

// Create a new order
router.post("/", authenticateClient, createOrder);

router.post("/accept/:order_id(\\d+)", authenticateDriver, acceptOrder);

router.post("/cancel/:order_id(\\d+)", authenticateDriver, cancelOrder);

router.post("/pick/:order_id(\\d+)", authenticateDriver, pickOrder);

router.post("/deliver/:order_id(\\d+)", authenticateDriver, deliverOrder);

// Delete an order
// ...

module.exports = router;
