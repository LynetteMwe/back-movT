const express = require("express");
const { authenticate } = require("../middleware/authenticate");
const { send_stk_push } = require("../services/mpesa");
const Order = require("../models/Order");
const methodNotAllowed = require("../middleware/methodNotAllowed");

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
	const { phone, amount, origin, destination, carType, itemType } = req.body;
	const ClientId = req.user.id;

	if (!phone) return res.status(400).json({ error: "Phone field required!" });
	if (!amount)
		return res.status(400).json({ error: "Amount field required!" });
	if (!destination)
		return res.status(400).json({ error: "Destination field required!" });
	// if (!carType)
	// return res.status(400).json({ error: "CarType field required!" });

	const {
		name: origName,
		latitude: origLat,
		longitude: origLng,
	} = origin || {
		name: undefined,
		latitude: undefined,
		longitude: undefined,
	};
	const {
		name: destName,
		latitude: destLat,
		longitude: destLng,
	} = destination || {
		name: undefined,
		latitude: undefined,
		longitude: undefined,
	};

	const data = await send_stk_push(phone, 1);
	// confirm amount paid then set order to paid
	// order.update({ paid: true })

	// save Order to database
	const order = await Order.create({
		ClientId,
		origin: origName,
		originLat: origLat, // originCoords = `${lat} ${lng}`
		originLng: origLng,
		destination: destName,
		destinationLat: destLat, // destinationCoords = `${lat} ${lng}`
		destinationLng: destLng,
		amount: amount,
		itemType: itemType,
		carType: carType,
	});

	return res.status(200).json({ order, stkData: data });
	// return res.status(200).json(data); // --> can remove after testing
});
router.all("/", methodNotAllowed);

// handle response from Mpesa
router.post("/myCallBackUrl", async (req, res) => {
	let body = req.body;
	if (Object.keys(body).length < 1) {
		return res.status(400).json({
			error: "No body posted",
		});
	}

	const ResultCode = body?.Body?.stkCallback?.ResultCode;
	const ResultDesc =
		body?.Body?.stkCallback?.ResultDesc || "Description not provided";
	let receipt,
		amount,
		phone,
		date = "";

	if (ResultCode != 0) {
		console.log(ResultCode, ResultDesc);
		return res.status(400).json({ error: `${ResultDesc}` });
	}
	let list = body.Body.stkCallback.CallbackMetadata.Item;
	list.forEach((item) => {
		if (item.Name === "MpesaReceiptNumber") {
			receipt = item.Value;
		}
		if (item.Name === "TransactionDate") {
			date = item.Value;
		}
		if (item.Name === "PhoneNumber") {
			phone = item.Value;
		}
		if (item.Name === "Amount") {
			amount = item.Value;
		}
	});
	// console.log(receipt)
	// console.log(name)
	// console.log(phone)
	// console.log(amount)

	try {
		const newTransaction = await Transactions.create({
			receipt,
			amount,
			phone,
			date,
		});
		console.log(ResultDesc, newTransaction);
		return res
			.status(201)
			.json({ message: `${ResultDesc}`, ...newTransaction });
	} catch (error) {
		console.log(error.message || error);
		return res.status(400).json({
			error: error.message,
		});
	}
});
router.all("/myCallBackUrl", methodNotAllowed);

router.get("/allTransactions", authenticate, async (req, res) => {
	try {
		const allTransactions = await Transactions.find();
		console.log(allTransactions);
		return res.status(200).json(allTransactions);
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});
router.all("/allTransactions", methodNotAllowed);

module.exports = router;
