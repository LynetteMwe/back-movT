const express = require("express");
const Client = require("../models/Client");
const Driver = require("../models/Driver");
const Order = require("../models/Order");
const { getUser, getOrder } = require("../utils/utils");

const router = express.Router();

// To do
// 1. To redefine model, get all users to one table
// 2. To add date filter to orders

//get all clients
router.get("/clients", async (req, res) => {
	const _ = await Client.findAll();
	users = _.map((user) => getUser(user));
	res.status(200).json(users);

	// Client.findAll().then((clients) => {
	// 	res.status(200).json(clients);
	// });
});

// Get all drivers
router.get("/drivers", async (req, res) => {
	const _ = await Driver.findAll();
	users = _.map((user) => getUser(user));
	res.status(200).json(users);
});

// Get all orders
router.get("/orders", async (req, res) => {
	const _ = await Order.findAll();
	orders = _.map((order) => getOrder(order));
	res.status(200).json(orders);
});

// Placed orders
router.get("/orders/placed", (req, res) => {
	Order.findAll({
		where: {
			status: "placed",
		},
	}).then((orders) => {
		orders = orders.map((order) => getOrder(order));
		res.status(200).json(orders);
	});
});

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
