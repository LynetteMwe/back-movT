const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Driver = require('./Driver')
const Client = require('./Client');

const Notification = sequelize.define("Notification", {
    id: {
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
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status:{
        type: DataTypes.BOOLEAN,
        default: '0' 
    }
    
});

// Create Notification table if it does not exist
Notification.sync()
    .then(() => {
        console.log("Notification table connected successfully!");
    })
    .catch(err => console.log("Failed to create Notifications table:", err));

Client.belongsToMany(Driver, {
    foreignkey:'id',
    through:Notification
})
Driver.belongsToMany(Client, {
    foreignkey:'id',
    through: Notification
})

module.exports = Notification;
