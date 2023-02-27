const express = require("express");
const { getClients } = require("../controllers/ClientsController");
const { getDrivers } = require("../controllers/DriversController");
const {
	getOrders,
	allPlacedorders,
} = require("../controllers/OrdersController");
const Client = require("../models/Client");
const Driver = require("../models/Driver");
const Order = require("../models/Order");
const { getUser, getOrder } = require("../utils/utils");

const router = express.Router();

// To do
// 1. To redefine model, get all users to one table
// 2. To add date filter to orders

//get all clients
router.get("/clients", getClients);

// Get all drivers
router.get("/drivers", getDrivers);

// Get all orders
router.get("/orders", getOrders);

// Placed orders
router.get("/orders/placed", allPlacedorders);

// Accepted orders
router.get("/orders/accepted", (req, res) => {
	Order.findAll({
		where: {
			status: "accepted",
		},
	}).then((orders) => {
		orders = orders.map((order) => getOrder(order));
		res.status(200).json(orders);
	});
});

// Picked orders
router.get("/orders/picked", (req, res) => {
	Order.findAll({
		where: {
			status: "picked",
		},
	}).then((orders) => {
		orders = orders.map((order) => getOrder(order));
		res.status(200).json(orders);
	});
});

// Delivered orders
router.get("/orders/delivered", (req, res) => {
	Order.findAll({
		where: {
			status: "delivered",
		},
	}).then((orders) => {
		orders = orders.map((order) => getOrder(order));
		res.status(200).json(orders);
	});
});

module.exports = router;
