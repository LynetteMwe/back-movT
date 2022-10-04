const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Driver = require("./Driver");

const Truck = sequelize.define(
    "Truck",
    {
        truck_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        truck_plate_no: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        service_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DriverId: {
            type: DataTypes.INTEGER,
            required: true,
            allowNull: true,
            references: {
                model: "Driver",
                key: "id",
            },
        },
    },
    {
        timestamps: false,
    }
);

// Driver.hasOne(Truck, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

// Truck.belongsTo(Driver,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' } )

// Create Truck table if it does not exist
Truck.sync()
    .then(() => {
        console.log("Truck table connected successfully!");
    })
    .catch(err => console.log("Failed to create Trucks table:", err));

module.exports = Truck;
