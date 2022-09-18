const express = require("express");
const connection = require("./connection");
const driverRoute = require("./routes/drivers");
const clientRoute = require("./routes/clients");
const ordersRoute = require('./routes/orders')
const notificationsRoute = require("./routes/notifications")
const truckRoute =  require("./routes/trucks")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/drivers", driverRoute);
app.use("/clients", clientRoute);
app.use("/orders", ordersRoute);
app.use("/notifications", notificationsRoute)
app.use("/trucks", truckRoute)


module.exports = { app, connection };
