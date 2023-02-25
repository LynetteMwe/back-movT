const Order = require("../models/Order");
const { sendNotificationToClient } = require("../services/notifications");
const { getOrder } = require("../utils/utils");
const { Op, col, fn, where: SqWhere, cast } = require("sequelize");

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

function formatDate(date) {
	const dt = moment(date).format();
	return dt;
}

const getOrders = async (req, res) => {
	const _ = await Order.findAll();
	orders = _.map((order) => getOrder(order));
	res.status(200).json(orders);
};

const getOrderById = (req, res, next) => {
	Order.findByPk(req.params.order_id)
		.then((order) => {
			if (!order)
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
			res.json(order);
		})
		.catch((error) => (res, error));
};

const createOrder = (req, res, next) => {
	const {
		ClientId,
		DriverId,
		type,
		itemType,
		carType,
		origin,
		destination,
		amount,
		status,
	} = req.body;
	Order.create({
		ClientId,
		DriverId,
		type,
		itemType,
		carType,
		origin,
		destination,
		amount,
		status,
	})
		.then((order) => {
			if (!order)
				return res.status(400).json({
					status: res.statusCode, // Bad Request
					error: "Provide ClientId, DriverId, type, item type, carType, origin, destination, amount, status",
				});
			res.json(order);
		})
		.catch((error) => serverError(res, error));
};

const getClientsOrders = (req, res, next) => {
	let start_date = req.query.start_date;
	let end_date = req.query.end_date; // default => new Date().format("dd-mm-yyyy")
	let status = req.query.status;
	let client_id = req.params.ClientId;

	let where = {
		ClientId: client_id,
	};

	if (status) where.status = status;

	if ((start_date && end_date) || (start_date && !end_date)) {
		where[Op.and] = {
			createdAt: {
				[Op.between]: [formatDate(start_date), formatDate(end_date)],
			},
		};
	} else if (!start_date && end_date) {
		where[Op.and] = {
			createdAt: {
				[Op.lte]: formatDate(end_date),
			},
		};
	}

	Order.findAll({ where })
		.then((orders) => {
			res.json(orders);
		})
		.catch((error) => {
			console.error("Error:", error);
			res.status(500).json({
				message: "A server error occurred!",
			});
		});
};

const getDriversOrders = (req, res, next) => {
	Order.findAll({ where: { DriverId: req.params.DriverId } })
		.then((user) => {
			res.json(user);
		})
		.catch((error) => (res, error));
};

const getDeliveredOrdersByDriver = (req, res, next) => {
	let start_date = req.query.start_date;
	let end_date = req.query.end_date; // default => new Date().format("dd-mm-yyyy")
	let driver_id = req.params.DriverId;

	let where = {
		DriverId: driver_id,
	};

	if ((start_date && end_date) || (start_date && !end_date)) {
		where[Op.and] = {
			updatedAt: {
				[Op.between]: [formatDate(start_date), formatDate(end_date)],
			},
		};
	} else if (!start_date && end_date) {
		where[Op.and] = {
			updatedAt: {
				[Op.lte]: formatDate(end_date),
			},
		};
	}

	Order.findAll({
		where: {
			...where,
			status: "delivered",
		},
	})
		.then((orders) => {
			res.json(orders);
		})
		.catch((error) => {
			console.error("Error:", error);
			res.status(500).json({
				message: "A server error occurred!",
			});
		});
};

const placedOrdersAccToDriver = async (req, res) => {
	const driver = req.user;

	let orders = [];
	// find all orders from the database which are relevant to the driver
	try {
		orders = await Order.findAll({
			where: {
				// status: "placed",
				carType: driver.carType,
				type: driver.type,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}

	// check if the driver has incomplete orders
	const drivers_orders = orders.filter((order) => {
		const deliv_or_placed = ["delivered", "placed"].includes(order.status);
		const incomplete = order.DriverId === driver.id && !deliv_or_placed;
		return incomplete;
	});
	if (drivers_orders.length > 0) {
		// if driver has incomplete orders
		return res.status(200).json(drivers_orders); // return the incomplete order(s)
	}

	// To ensure delivered orders don't show on placed orders
	const placed_orders = orders.filter((order) => {
		const placed = ["placed"].includes(order.status);
		const to_display = order.DriverId === null && placed;
		return to_display;
	});

	// if driver has no incomplete orders, return placed orders
	return res.status(200).json(placed_orders);
};

const acceptOrder = (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
			}
			if (order.status !== "placed") {
				res.status(400).json(
					"Sorry, you can only accept a placed order."
				);
				return;
			}

			// if order is found, update the order
			await order.update({ status: "accepted", DriverId: req.user.id });

			sendNotificationToClient(order.ClientId, {
				title: "Order Accepted",
				body: `Your order[id=${order.order_id}] has been accepted by ${req.user.username}`,
				data: { order, driver: req.user },
			});

			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).json(error);
		});
};

const cancelOrder = (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
			}

			if (order.status !== "accepted") {
				res.status(400).json(
					"Sorry, you cannot cancel an accepted order."
				);
				return;
			}

			// if order is found, update the order
			await order.update({ status: "placed", DriverId: null });

			sendNotificationToClient(order.ClientId, {
				title: "Order Cancelled",
				body: `Your order[id=${order.order_id}] has been cancelled by ${req.user.username}`,
				data: { order, driver: req.user },
			});

			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).json(error);
		});
};

const pickOrder = (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
			}

			if (order.status !== "accepted") {
				res.status(400).json(
					"Sorry, you can only pick an accepted order."
				);
				return;
			}

			// if order is found, update the order
			await order.update({ status: "picked", DriverId: req.user.id });

			sendNotificationToClient(order.ClientId, {
				title: "Order Picked",
				body: `Your order[id=${order.order_id}] has been picked by ${req.user.username}`,
				data: { order, driver: req.user },
			});

			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).json(error);
		});
};

const deliverOrder = (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
			}

			if (order.status !== "picked") {
				res.status(400).json(
					"Sorry, you can only deliver picked orders."
				);
				return;
			}

			// if order is found, update the order
			await order.update({ status: "delivered", DriverId: req.user.id });

			sendNotificationToClient(order.ClientId, {
				title: "Order Delivered",
				body: `Your order[id=${order.order_id}] has been delivered by ${req.user.username}`,
				data: { order, driver: req.user },
			});

			return res.status(200).json(order);
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).json(error);
		});
};

module.exports = {
	getOrders,
	getOrderById,
	createOrder,
	getDriversOrders,
	getDeliveredOrdersByDriver,
	getClientsOrders,
	placedOrdersAccToDriver,
	acceptOrder,
	cancelOrder,
	pickOrder,
	deliverOrder,
};
