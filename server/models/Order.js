const { DataTypes } = require("sequelize");
const sequelize = require("../connection");

const Order = sequelize.define("Order", {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
});

// Create Order table if it does not exist
Order.sync()
    .then(() => {
        console.log("Order table connected successfully!");
    })
    .catch(err => console.log("Failed to create Orders table:", err));

module.exports = Order;
