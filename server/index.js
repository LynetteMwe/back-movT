const express = require("express");
const {
    authRoute,
    authClientRoute,
    authDriverRoute,
    clientRoute,
    driverRoute,
    ordersRoute,
    notificationsRoute,
    truckRoute,
    userRoute,
    ordersPlacedRoute
} = require("./routes");
const { authenticate } = require("./middleware/authenticate");
const { authenticateDriver } = require("./middleware/authenticateDriver");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/authClients", authClientRoute);
app.use("/authDrivers", authDriverRoute)

// app.use("/drivers/orders", authenticateDriver, ordersRoute);
app.use("/drivers", driverRoute);

// app.use("/clients/orders", authenticate, ordersRoute);
app.use("/clients", clientRoute);
app.use("/orders", ordersRoute);
app.use("/ordersPlaced", ordersPlacedRoute);


app.use("/notifications", notificationsRoute);
app.use("/trucks", truckRoute);

module.exports = { app };
