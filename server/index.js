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
	adminsRoute,
} = require("./routes");
const Client = require("./models/Client");
const Driver = require("./models/Driver");
const {
	authenticateClient,
	authenticateDriver,
	authenticate,
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

app.use("/admin", adminsRoute);

app.post("/expo-push-token", authenticate, async (req, res) => {
	const pushToken = req.body.expoPushToken;
	const driver_id = req.body.DriverId;
	const client_id = req.body.ClientId;

	if (!pushToken) {
		return res.status(400).send({
			status: res.statusCode,
			error: "No expoPushToken provided",
		});
	}

	if (!driver_id && !client_id) {
		return res.status(400).json({
			status: res.statusCode,
			error: "Either DriverId or ClientId should be provided",
		});
	}

	let user;
	try {
		if (driver_id) user = await Driver.findByPk(driver_id);
		else if (client_id) user = await Client.findByPk(client_id);

		await user.update({ resetToken: pushToken });
		return res.status(200).json("Push token updated!");
	} catch (err) {
		console.log(err);
		return res.status(500).json("Failed to update push token");
	}
});

module.exports = { app };
