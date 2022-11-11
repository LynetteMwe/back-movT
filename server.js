require("dotenv").config();
const http = require("http");
const { app } = require("./server/index");
const methodNotAllowed = require("./server/middleware/methodNotAllowed");
const port = process.env.PORT;

app.get("/", (req, res) => {
	res.json({
		message: "ok",
		routes: [
			"/authClients/login",
			"/authClients/register",
			"/authClients/logout",
			"/authDrivers/login",
			"/authDrivers/register",
			"/authDrivers/logout",
			"/drivers",
			"/clients",
			"/notifications",
			"/trucks",
			"/orders",
			"/transactions",
			"/mpesa/stk",
		],
	});
});
app.all("/", methodNotAllowed);

app.listen(port, () => {
	console.log(`Server listening on port: ${process.env.port}`);
});

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
