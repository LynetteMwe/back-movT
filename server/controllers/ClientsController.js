const express = require("express");
const Client = require("../models/Client");
const { getUser, serverError } = require("../utils/utils");

const getClients = async (req, res) => {
	const _ = await Client.findAll();
	users = _.map((user) => getUser(user));
	res.status(200).json(users);

	// Client.findAll().then((clients) => {
	// 	res.status(200).json(clients);
	// });
};

const getClient = (req, res) => {
	Client.findByPk(req.params.id)
		.then((user) => {
			if (!user)
				return res.status(404).json({
					status: res.statusCode, // Not Found
					error: "User not found!",
				});
			res.json(getUser(user));
		})
		.catch((error) => serverError(res, error));
};

const getClientProfile = (req, res) => {
	return res.status(200).json(getUser(req.user));
};

const registerClient = (req, res) => {
	const { username, contact, email, password } = req.body;
	Client.create({
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
			res.json(getUser(user, true));
		})
		.catch((error) => serverError(res, error));
};

const updateClientProfile = (req, res) => {
	const { username, contact } = req.body;

	Client.findByPk(req.user.id)
		.then(async (client) => {
			// if client is found, update the details
			await client.update({ username, contact });

			res.status(200).json(getUser(client));
		})
		.catch((error) => {
			console.log(error);
			serverError(res, error);
		});
};

module.exports = {
	getClients,
	getClient,
	getClientProfile,
	registerClient,
	updateClientProfile,
};
