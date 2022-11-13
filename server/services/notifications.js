const { Expo } = require("expo-server-sdk");
const Client = require("../models/Client");
const Driver = require("../models/Driver");

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

// let pushToken = "ExponentPushToken[SUF3_mK6IZG7ywhiOKLFvS]";
async function handleSendNotification(messages) {
	// The Expo push notification service accepts batches of notifications so
	// that you don't need to send 1000 requests to send 1000 notifications. We
	// recommend you batch your notifications to reduce the number of requests
	// and to compress them (notifications with similar content will get
	// compressed).
	if (typeof messages !== "array") return;

	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];
	(async () => {
		// Send the chunks to the Expo push notification service. There are
		// different strategies you could use. A simple one is to send one chunk at a
		// time, which nicely spreads the load out over time:
		for (let chunk of chunks) {
			try {
				let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				// console.log(ticketChunk);
				tickets.push(...ticketChunk);
				// NOTE: If a ticket contains an error code in ticket.details.error, you
				// must handle it appropriately. The error codes are listed in the Expo
				// documentation:
				// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
			} catch (error) {
				console.error(error);
			}
		}
	})();

	let receiptIds = [];
	for (let ticket of tickets) {
		// NOTE: Not all tickets have IDs; for example, tickets for notifications
		// that could not be enqueued will have error information and no receipt ID.
		if (ticket.id) {
			receiptIds.push(ticket.id);
		}
	}

	let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	(async () => {
		// Like sending notifications, there are different strategies you could use
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
							// The error codes are listed in the Expo documentation:
							// https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
							// You must handle the errors appropriately.
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

// Sends a notification to one Client
async function sendNotificationToClient(client_id, { title, body, data }) {
	if (!client_id) return;
	if (!title || !body) return;

	let pushToken;

	try {
		// fetch the push token of the driver
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
