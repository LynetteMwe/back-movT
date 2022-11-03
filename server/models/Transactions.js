const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Client = require("./Client");
const Order = require("./Order");

const Transaction = sequelize.define("Transaction", {
    receipt: {
        type: DataTypes.STRING,
        required: true
    },
    ClientId: {    
     type: DataTypes.INTEGER,
     required: true,
     allowNull: false,
     references: {
         model: Client,
         key: "id",
    }},
    OrderId:{
     type: DataTypes.INTEGER,
     required: true,
     allowNull: false,
     references: {
         model: Order,
         key: "order_id",
    }},
    amount:{
        type: DataTypes.INTEGER,
        required: true,
    },
    phone:{
        type: DataTypes.STRING,
        required: true,
    },
    date:{
        type: DataTypes.STRING,
        required: true,
    },
},
    {
        timestamps: false
    }
);

Client.hasOne(Transaction, {
 foreignKey: 'ClientId'
})
Transaction.belongsTo(Client)

Order.hasOne(Transaction,{
 foreignKey: 'OrderId'
})
// Transaction.belongsTo(Order)
// Create Transaction table if it does not exist

Transaction.sync()
    .then(() => {
        console.log("Transaction table connected successfully!");
    })
    .catch(err => console.log("Failed to create Transactions table:", err));

module.exports = Transaction;
