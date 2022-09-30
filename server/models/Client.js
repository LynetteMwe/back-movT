const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const { encryptPassword } = require("../utils/utils");

const Client = sequelize.define("Client_B", {
    client_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username:{
     type:DataTypes.STRING,
     unique: true, 
     allowNull: false,
     
    }, 
    contact:{
     type:DataTypes.STRING,
     unique: true,
     allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
        unique: true,
    },
    // type: {},
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue("password", encryptPassword(value));
        },
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
        // create token as defaultValue
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

// Create Client table if it does not exist
Client.sync()
    .then(() => {
        console.log("Client table connected successfully!");
    })
    .catch(err => console.log("Failed to create Clients table:", err));

module.exports = Client;
