require("dotenv").config();
const http = require("http");
const { app } = require("./server/index");
const methodNotAllowed = require("./server/middleware/methodNotAllowed");

const prettyjson = require('prettyjson'),
    bodyParser = require('body-parser'),
    axios = require('axios'),
    config = require('./config'),
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    consumer_key = config.consumerKey,
    consumer_secret = config.secret,
    passkey = config.passkey,
    shortcode = config.shortcode,
    port = config.port,
    auth = "Basic " + Buffer.from(`${consumer_key}:${consumer_secret}`).toString("base64");

let oauth_token;

const prettyJsonOptions = {
    noColor: true
};
app.use(bodyParser.json());


async function getOauthToken() {
    try {
        let response = await axios.get(url, {
            headers: {
                "Authorization": auth
            }
        })
        oauth_token = response.data.access_token;
    } catch (error) {
        console.log("Auth Error: ", error.response);
    }
}

function startInterval(seconds) {
    setInterval(function () { getOauthToken() }, seconds * 1000);
}

function pad2(n) { return n < 10 ? '0' + n : n }

function formatDate() {
    let date = new Date();
    let correctDate =
        date.getFullYear().toString() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        pad2(date.getSeconds());
    return correctDate;
}

app.post("/mpesa", function (req, res) {
    if (req.body.phoneNumber && req.body.amount) {
        let timestamp = formatDate();
        let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            password = Buffer.from(shortcode + passkey + timestamp).toString("base64"),
            auth = "Bearer " + oauth_token;
        axios({
            method: 'POST',
            url: url,
            headers: {
                "Authorization": auth
            },
            data: {
                "BusinessShortCode": shortcode,                     
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": req.body.amount,                          
                "PartyA": req.body.phoneNumber,                     
                "PartyB": shortcode,                                   
                "PhoneNumber": req.body.phoneNumber,                
                "CallBackURL": process.env.CALLBACK_URL, // confirmation Url
                "AccountReference": "Example",                      
                "TransactionDesc": "Testing mpesa"                  
            }
        }).then(response => {
            res.status(200).send('Stk push sent to phone');
            let responseBody = response.data;
            //Using the above responseBody handle the data.
        }).catch(error => {
            res.status(500).send('There was an error');
            console.error(`LNMO error is: ${error}`);
        });
    } else {
        res.status(400).send('Bad request');
    }
});

// C2B ConfirmationURL - /api/v1/c2b/confirmation
app.post('/api/v1/c2b/confirmation', function (req, res) {
    console.log('-----------C2B CONFIRMATION REQUEST------------');
    console.log(prettyjson.render(req.body, prettyJsonOptions));
    console.log('-----------------------');

    let message = {
        "ResultCode": 0,
        "ResultDesc": "Success"
    };
    res.json(message);
});

//Get auth token then start server
getOauthToken().then(() => {
    //Token gotten successfully, we can now start to listen
    app.listen(port, function () {
        //Request New OAuth-Token after every 58mins since tokens expire after 1hr.
        startInterval(3499);
        console.log(`MPESA Server has started at port: ${port}`);
    });
});


app.get("/", (req, res) => {
    res.json({
        message: "ok",
        routes: [
            "/authClients/login",
            "/authClients/register",
            "/authClients/logout",
            "/users",
            "/users/:id",
            "/drivers",
            "/clients",
            "/notifications",
            "/trucks",
            "/orders",
        ],
    });
});
app.all("/", methodNotAllowed);

// Middleware to return custom 404 on route not found
app.use((req, res, next) => {
    res.status(404).json({
        status: res.statusCode,
        message: `Route '${req.path}' not found`,
    });
});

// Custom error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        status: res.statusCode,
        message: "A server error occured",
    });
});

