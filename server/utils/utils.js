const bcrypt = require("bcrypt");

const isEmail = (email) => {
	if (typeof email !== "string") {
		return false;
	}
	const emailRegex =
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
	return emailRegex.test(email);
};

const isPassword = (password) => {
	if (typeof password !== "string") {
		return false;
	}
	const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

	// "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

	return pwRegex.test(password);
};

const capitalize = (str) => {
	return str[0].toUpperCase() + str.slice(1);
};

const serverError = (res, error) => {
	res.statusCode = error?.original?.code === "ER_DUP_ENTRY" ? 400 : 500;

	// Check for Sequelize Errors
	if (error?.errors) {
		const errors = error.errors;
		let lst = [];
		errors?.forEach((error) => {
			// extract all the error info you need
			const { type, message, validatorKey, path, value } = error;
			lst.push({
				type: capitalize(type),
				message: capitalize(message),
				validatorKey: capitalize(validatorKey),
				path: capitalize(path),
				value: capitalize(value),
			});
		});
		return res.status(400).json(lst);
	}

	return res.json({
		status: res.statusCode, // Internal Server Error
		error: {
			name: error?.name,
			code: error?.original?.code,
			message: error?.original?.sqlMessage,
		},
	});
};

function encryptPassword(plainText) {
	return bcrypt.hashSync(plainText, 10);
}

function comparePassword(plainText, hash) {
	return bcrypt.compareSync(plainText, hash);
}

function getUser(user, showToken = false) {
	const obj = {
		id: user?.id,
		username: user?.username,
		contact: user?.contact,
		email: user?.email,
	};
	if (showToken) obj.token = user?.token;
	return obj;
}

function getDriver(user, showToken = false) {
	const obj = {
		id: user?.id,
		username: user?.username,
		contact: user?.contact,
		email: user?.email,
		type: user?.type,
		carType: user?.carType,
		vehicle_plate_no: user?.vehicle_plate_no,
	};
	if (showToken) obj.token = user?.token;
	return obj;
}

function getOrder(order) {
	const obj = {
		id: order?.order_id,
		clientId: order?.ClientId,
		driverId: order?.DriverId,
		type: order?.type,
		itemType: order?.itemType,
		carType: order?.carType,
		origin: order?.origin,
		destination: order?.destination,
		amount: order?.amount,
		status: order?.status,
		createdAt: order?.createdAt,
	};
	return obj;
}

function generateToken(email) {
	const str = email + new Date().toUTCString();
	return bcrypt.hashSync(str, 10);
}

module.exports = {
	isEmail,
	isPassword,
	serverError,
	encryptPassword,
	comparePassword,
	getUser,
	getDriver,
	getOrder,
	generateToken,
};
