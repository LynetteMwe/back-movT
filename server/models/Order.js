const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Driver = require('./Driver')
const Client = require('./Client');

const Order = sequelize.define("Order", {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    ClientId: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: true,
        references: {
            model: Client,
            key: "id",
    }},
    DriverId:{
        type: DataTypes.INTEGER,
        required: true,
        allowNull: true,
        references: {
            model: Driver,
            key: "id",
    }},
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
    status:{
        type: DataTypes.BOOLEAN,
        default: '0' 
    }
    
});

// Create Order table if it does not exist
Order.sync()
    .then(() => {
        console.log("Order table connected successfully!");
    })
    .catch(err => console.log("Failed to create Orders table:", err));

Client.belongsToMany(Driver, {
    foreignkey:'id',
    through:Order
})
Driver.belongsToMany(Client, {
    foreignkey:'id',
    through: Order
})

module.exports = Order;
