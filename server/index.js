const express = require("express");
const {
    authRoute,
    driverRoute,
    clientRoute,
    ordersRoute,
    notificationsRoute,
    truckRoute,
    userRoute,
} = require("./routes");
const { authenticate, passport } = require("./middleware/authenticate");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", authenticate, userRoute);
app.use("/drivers", authenticate, driverRoute);
app.use("/clients", authenticate, clientRoute);
app.use("/orders", authenticate, ordersRoute);
app.use("/notifications", authenticate, notificationsRoute);
app.use("/trucks", authenticate, truckRoute);

module.exports = { app };
