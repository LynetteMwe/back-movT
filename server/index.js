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
    userRoute
} = require("./routes");
const { authenticate } = require("./middleware/authenticate");
const { authenticateDriver } = require("./middleware/authenticateDriver");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/authClients", authClientRoute);
app.use("/authDrivers", authDriverRoute)

// app.use("/drivers/orders", authenticateDriver, ordersRoute);
app.use("/drivers", authenticateDriver, driverRoute);

// app.use("/clients/orders", authenticate, ordersRoute);
app.use("/clients", authenticate, clientRoute);

app.use("/notifications", authenticate, notificationsRoute);
app.use("/trucks", authenticate, truckRoute);

module.exports = { app };
