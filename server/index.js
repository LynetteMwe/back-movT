const express = require("express");
const connection = require("./connection");
const driverRoute = require("./routes/drivers");
const clientRoute = require("./routes/clients");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/drivers", driverRoute);
app.use("/clients", clientRoute);

module.exports = { app, connection };
