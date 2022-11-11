const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Driver = require("./Driver");
const Order = require("./Order");

const Notification = sequelize.define("Notification", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	OrderId: {
		type: DataTypes.INTEGER,
		required: true,
		allowNull: false,
		references: {
			model: Order,
			key: "order_id",
		},
	},
	DriverId: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: Driver,
			key: "id",
		},
	},
	message: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	status: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
});

// Create Notification table if it does not exist
Notification.sync()
	.then(() => {
		console.log("Notification table connected successfully!");
	})
	.catch((err) => console.log("Failed to create Notifications table:", err));

module.exports = Notification;
