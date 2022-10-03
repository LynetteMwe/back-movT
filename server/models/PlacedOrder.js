const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Driver = require('./Driver')
const Client = require('./Client');
const Order = require("./Order");

const PlacedOrder = sequelize.define("PlacedOrder", {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    client_id:{
     type: DataTypes.INTEGER,
     allowNull:false,
    },
    driver_id:{
     type: DataTypes.INTEGER,
     allowNull:false,
    },
        
    },
    {
        timestamps: false
    }
);

Client.hasMany(Order)
Order.belongsTo(Client)

Driver.hasMany(Order)
Order.belongsTo(Driver)

// Create PlacedOrder table if it does not exist
PlacedOrder.sync()
    .then(() => {
        console.log("PlacedOrder table connected successfully!");
    })
    .catch(err => console.log("Failed to create PlacedOrders table:", err));




module.exports = PlacedOrder;
