const express = require("express");
const Order = require("../models/Order");
const { Op, col, fn, where: SqWhere, cast } = require("sequelize");
const moment = require("moment");
const {
	authenticateDriver,
	authenticateClient,
} = require("../middleware/authenticate");
const Driver = require("../models/Driver");
const {
	sendNotificationToDriver,
	sendNotificationToClient,
} = require("../services/notifications");

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

function formatDate(date) {
	const dt = moment(date).format();
	return dt;
}

router.get("/:order_id(\\d+)", (req, res, next) => {
	Order.findByPk(req.params.order_id)
		.then((user) => {
			if (!user)
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
			res.json(user);
		})
		.catch((error) => (res, error));
});

// get all orders per client
router.get("/clients/:ClientId(\\d+)", authenticateClient, (req, res, next) => {
	let start_date = req.query.start_date;
	let end_date = req.query.end_date; // default => new Date().format("dd-mm-yyyy")
	let client_id = req.params.ClientId;

	let where = {
		ClientId: client_id,
	};

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
});
// get all orders per Driver
router.get("/drivers/:DriverId(\\d+)", authenticateDriver, (req, res, next) => {
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
});

// get all orders per driver
router.get("/drivers/:DriverId(\\d+)", authenticateDriver, (req, res, next) => {
	Order.findAll({ where: { DriverId: req.params.DriverId } })
		.then((user) => {
			res.json(user);
		})
		.catch((error) => (res, error));
});

router.get("/placed", authenticateDriver, async (req, res) => {
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
});

router.post("/accept/:order_id(\\d+)", authenticateDriver, (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
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
});

router.post("/cancel/:order_id(\\d+)", authenticateDriver, (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
			}

			// if order is found, update the order
			await order.update({ status: "cancelled", DriverId: null });

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
});

router.post("/pick/:order_id(\\d+)", authenticateDriver, (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
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
});

router.post("/deliver/:order_id(\\d+)", authenticateDriver, (req, res) => {
	// Find an order by its primary key `id`
	Order.findByPk(req.params.order_id)
		.then(async (order) => {
			if (order === null) {
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "Order not found!",
				});
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
});

// Get all users
router.get("/", async (req, res) => {
	const _ = await Order.findAll();
	users = _.map((user) => user);
	res.status(200).json(users);
});

// Create a new user
router.post("/", (req, res, next) => {
	const {
		ClientId,
		DriverId,
		itemType,
		origin,
		destination,
		amount,
		status,
	} = req.body;
	Order.create({
		ClientId,
		DriverId,
		itemType,
		origin,
		destination,
		amount,
		status,
	})
		.then((user) => {
			if (!user)
				return res.status(400).json({
					status: res.statusCode, // Bad Request
					error: "Provide ClientId, DriverId, item type, origin, destination, amount, status",
				});
			res.json(user);
		})
		.catch((error) => serverError(res, error));
});

// Update a user
// ...

// Delete a user
// ...

module.exports = router;

// const express = require('express')
// const connection = require('../connection')
// const router = express.Router()

// router.get('/', (req, res, next)=>{
//  query = "SELECT * FROM orders"
//  connection.query(query, (err, results)=>{
//   if(!err){
//    return res.status(200).json(results)
//   }else{
//    return res.status(500).json(err)
//   }
//  })
// })

// router.get('/:order_id', (req, res, next)=>{
//  const id = req.params.order_id;
//  let orders = req.body
//  query = "SELECT * FROM orders where order_id=?"
//  connection.query(query, id,(err, results)=>{
//    if(!err){
//    console.log(results)
//    return res.status(200).json(results)
//    }else{
//    return res.status(500).json(err)
//    }
//  })
//  })

// router.post('/add', (req, res)=>{
//  let orders = req.body

//  const client_id = req.params.client_id
//  const driver_id = req.params.driver_id
//  const description = req.params.item_description
//  const origin = req.params.pick_up_from
//  const destination = req.params.destination
//  const amount = req.params.amount

//  query =
//  "insert into orders (client_id, driver_id, item_description, pick_up_from, destination, amount) values(?, ?, ?, ?, ?, ?)"
//  connection.query(query, [orders.client_id, orders.driver_id,  orders.description, orders.origin, orders.destination, orders.amount], (err,results)=>{
//   if(!err){
//    return res.status(200).json({message:"Order Added Successfully"})
//   }else{
//    return res.status(500).json({message:err})
//   }
//  })

// })

// module.exports = router
