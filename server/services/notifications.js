const { Expo } = require("expo-server-sdk");
const Client = require("../models/Client");
const Driver = require("../models/Driver");

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

// let pushToken = "ExponentPushToken[SUF3_mK6IZG7ywhiOKLFvS]";
async function handleSendNotification(messages) {
	// batch your notifications to reduce the number of requests
	if (!Array.isArray(messages)) return;

	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];
	(async () => {
		// Send the chunks to the Expo push notification service.
		for (let chunk of chunks) {
			try {
				let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				// console.log(ticketChunk);
				tickets.push(...ticketChunk);
				// If a ticket contains an error code in ticket.details.error
			} catch (error) {
				console.error(error);
			}
		}
	})();

	let receiptIds = [];
	for (let ticket of tickets) {
		if (ticket.id) {
			receiptIds.push(ticket.id);
		}
	}

	let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	(async () => {
		// to retrieve batches of receipts from the Expo service.
		for (let chunk of receiptIdChunks) {
			try {
				let receipts = await expo.getPushNotificationReceiptsAsync(
					chunk
				);
				console.log(receipts);

				// The receipts specify whether Apple or Google successfully received the
				// notification and information about an error, if one occurred.
				for (let receiptId in receipts) {
					let { status, message, details } = receipts[receiptId];
					if (status === "ok") {
						continue;
					} else if (status === "error") {
						console.error(
							`There was an error sending a notification: ${message}`
						);
						if (details && details.error) {
							console.error(`The error code is ${details.error}`);
						}
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	})();
}

// Sends a notification to one Driver
async function sendNotificationToDriver(driver_id, { title, body, data }) {
	if (!driver_id) return;
	if (!title || !body) return;

	let pushToken;

	try {
		// fetch the push token of the driver
		const driver = await Driver.findByPk(driver_id);
		pushToken = driver.resetToken;
	} catch (error) {
		console.log(error);
	}

	// validate the push token
	if (!Expo.isExpoPushToken(pushToken)) {
		console.error(`Push token ${pushToken} is not a valid Expo push token`);
		return false;
	}

	const message = {
		to: pushToken,
		sound: "default",
		title: title,
		body: body,
		data: data,
	};

	handleSendNotification([message]);
}

// Sends a notification to one Client
async function sendNotificationToClient(client_id, { title, body, data }) {
	if (!client_id) return;
	if (!title || !body) return;

	let pushToken;

	try {
		// fetch the push token of the client
		const client = await Client.findByPk(client_id);
		pushToken = client.resetToken;
	} catch (error) {
		console.log(error);
	}

	// validate the push token
	if (!Expo.isExpoPushToken(pushToken)) {
		console.error(`Push token ${pushToken} is not a valid Expo push token`);
		return false;
	}

	// Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
	const message = {
		to: pushToken,
		sound: "default",
		title: title,
		body: body,
		data: data,
	};

	handleSendNotification([message]);
}

function sendNotificationToAllDrivers() {}

function sendNotificationToAllClients() {}

module.exports = { sendNotificationToDriver, sendNotificationToClient };
