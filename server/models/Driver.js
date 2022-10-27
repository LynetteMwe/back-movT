const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const { encryptPassword } = require("../utils/utils");

const Driver = sequelize.define("Driver", {
    id: {
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
    vehicle_plate_no: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    service_type: { 
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// Create Driver table if it does not exist
Driver.sync()
    .then(() => {
        console.log("Driver table connected successfully!");
    })
    .catch(err => console.log("Failed to create Drivers table:", err));

module.exports = Driver;
