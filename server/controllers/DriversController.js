const Driver = require("../models/Driver");
const { serverError, getDriver } = require("../utils/utils");

const getDrivers = async (req, res) => {
	const _ = await Driver.findAll();
	users = _.map((user) => getDriver(user));
	res.status(200).json(users);
};

const getDriverByID = (req, res, next) => {
	Driver.findByPk(req.params.id)
		.then((user) => {
			if (!user)
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "User not found!",
				});
			res.json(getDriver(user));
		})
		.catch((error) => serverError(res, error));
};

const getDriverProfile = (req, res, next) => {
	const driver = {
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		contact: req.user.contact,
		carType: req.user.carType,
		vehicle_plate_no: req.user.vehicle_plate_no,
		type: req.user.type,
	};
	return res.status(200).json(driver);
};

const createDriver = (req, res, next) => {
	const { username, contact, email, password } = req.body;
	Driver.create({
		username,
		contact,
		email,
		password,
		token: generateToken(email),
	})
		.then((user) => {
			if (!user)
				return res.status(400).json({
					status: res.statusCode, // Bad Request
					error: "Provide username, contact, email, password",
				});
			res.json(getDriver(user, true));
		})
		.catch((error) => serverError(res, error));
};

const updateDriverProfile = (req, res) => {
	const { username, contact, carType, type, vehicle_plate_no } = req.body;

	const driverObj = {
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		contact: req.user.contact,
		carType: req.user.carType,
		vehicle_plate_no: req.user.vehicle_plate_no,
		type: req.user.type,
	};

	Driver.findByPk(req.user.id)
		.then(async (driver) => {
			// if driver is found, update the details
			await driver.update({
				username,
				contact,
				carType,
				type,
				vehicle_plate_no,
			});

			res.status(200).json(driverObj);
		})
		.catch((error) => {
			console.log(error);
			serverError(res, error);
		});
};

module.exports = {
	getDrivers,
	getDriverByID,
	getDriverProfile,
	updateDriverProfile,
	createDriver,
};
