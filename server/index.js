const express = require("express");
const passport = require("passport");
const SQ = require("sequelize");
const BearerStrategy = require("passport-http-bearer").Strategy;
const morgan = require("morgan");
const {
	authClientRoute,
	authDriverRoute,
	clientRoute,
	driverRoute,
	ordersRoute,
	notificationsRoute,
	truckRoute,
	userRoute,
	transactionsRoute,
} = require("./routes");
const Client = require("./models/Client");
const Driver = require("./models/Driver");
const {
	authenticateClient,
	authenticateDriver,
} = require("./middleware/authenticate");

passport.use(
	new BearerStrategy(function (token, done) {
		// check if the token exists within a client
		Client.findOne({ where: { token: { [SQ.Op.like]: token } } })
			.then((user) => {
				if (user) {
					return done(null, user, { scope: "all", client: true });
				} else {
					// If token is not found in clients, look in the driver table
					Driver.findOne({
						where: { token: { [SQ.Op.like]: token } },
					})
						.then((user) => {
							if (!user) return done(null, false);
							return done(null, user, {
								scope: "all",
								driver: true,
							});
						})
						.catch((err) => {
							if (err) return done(err);
						});
				}
			})
			.catch((err) => {
				if (err) return done(err);
			});
	})
);

const app = express();
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/authClients", authClientRoute);
app.use("/authDrivers", authDriverRoute);

app.use("/drivers/orders", authenticateDriver, ordersRoute);
app.use("/drivers", authenticateDriver, driverRoute);

app.use("/clients/orders", authenticateClient, ordersRoute);
app.use("/clients", authenticateClient, clientRoute);

app.use("/orders", ordersRoute);

app.use("/payments", transactionsRoute);

app.use("/notifications", notificationsRoute);

module.exports = { app };
