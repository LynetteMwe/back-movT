const axios = require("axios");

function parse_mpesa_phone_number(contact) {
	if (!contact) return false;

	if (contact.startsWith("+254") && contact.length === 13) {
		return contact.replace("+254", "254");
	} else if (contact.startsWith("254") && contact.length === 12) {
		return contact;
	} else if (contact.startsWith("0") && contact.length === 10) {
		return contact.replace("0", "254");
	} else if (contact.length === 9) {
		return "254" + contact;
	}
	return false;
}

const get_access_token = async () => {
	let consumer_key = process.env.consumer_key; // CONSUMER_KEY
	let consumer_secret = process.env.consumer_secret; // CONSUMER_SECRET

	let url = process.env.oauth_token_url; // OAUTH_TOKEN_URL

	//form a buffer of the consumer key and secret
	let buffer = new Buffer.from(`${consumer_key}:${consumer_secret}`);
	const token = buffer.toString("base64");

	const config = {
		headers: {
			Authorization: `Basic ${token}`,
		},
	};

	try {
		let { data } = await axios.get(url, config);
		return data["access_token"];
	} catch (error) {
		console.log(error.data || error);
		return null;
	}
};

async function send_stk_push(phone, amount) {
	if (!phone || !amount) return null;

	const date = new Date();
	const timestamp =
		date.getFullYear() +
		("0" + (date.getMonth() + 1)).slice(-2) +
		("0" + date.getDate()).slice(-2) +
		("0" + date.getHours()).slice(-2) +
		("0" + date.getMinutes()).slice(-2) +
		("0" + date.getSeconds()).slice(-2);

	let token = await get_access_token();
	if (!token) {
		console.log("Mpesa access Token cannot be null!!!");
		return null;
	}

	let bs_short_code = process.env.lipa_na_mpesa_shortcode;
	let passkey = process.env.lipa_na_mpesa_passkey;
	let callBackUrl = process.env.callback_url;
	let officialPhoneNo = parse_mpesa_phone_number(phone);

	let password = new Buffer.from(
		`${bs_short_code}${passkey}${timestamp}`
	).toString("base64");
	let transcation_type = "CustomerPayBillOnline";

	let partyA = officialPhoneNo;
	let partyB = bs_short_code;
	let phoneNumber = officialPhoneNo;
	let accountReference = officialPhoneNo;
	let transaction_desc = "Testing";

	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	};
	const body = {
		BusinessShortCode: bs_short_code,
		Password: password,
		Timestamp: timestamp,
		TransactionType: transcation_type,
		Amount: amount,
		PartyA: partyA,
		PartyB: partyB,
		PhoneNumber: phoneNumber,
		CallBackURL: callBackUrl,
		AccountReference: accountReference,
		TransactionDesc: transaction_desc,
	};
	const url = process.env.lipa_na_mpesa_url;

	return new Promise((resolve, _) => {
		axios
			.post(url, body, { headers: headers })
			.then(({ data }) => {
				resolve(data);
			})
			.catch((error) => {
				console.log("STK PUSH Error:", error.data);
				resolve(null);
			});
	});
}

module.exports = {
	parse_mpesa_phone_number,
	send_stk_push,
};
