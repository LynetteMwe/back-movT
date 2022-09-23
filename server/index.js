const express = require("express");
const driverRoute = require("./routes/drivers");
const clientRoute = require("./routes/clients");
const ordersRoute = require("./routes/orders");
const notificationsRoute = require("./routes/notifications");
const truckRoute = require("./routes/trucks");
const userRoute = require("./routes/user");

const authRoute = require("./routes/auth");
// const logger = require('morgan');
// const passport = require('passport');
// const session = require("express-session");
// const connection = require("./connection")

// const session = require('express-session');
// const mysqlStore = require('express-mysql-session')(session);
// const sessionStore = new mysqlStore(options);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("", userRoute);
app.use("/drivers", driverRoute);
app.use("/clients", clientRoute);
app.use("/orders", ordersRoute);
app.use("/notifications", notificationsRoute);
app.use("/trucks", truckRoute);
app.use("/auth", authRoute);

// app.use(session({
//  secret: 'keyboard cat',
//  resave: false,
//  saveUninitialized: false
//  // store: new connection({ db: 'sessions.db', dir: './var/db' })
//  // store: connection
//  // store: sessionStore
// }));
// app.use(passport.authenticate('session'));

module.exports = { app };
