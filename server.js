require("dotenv").config();
const http = require("http");
const { app } = require("./server/index");
const methodNotAllowed = require("./server/middleware/methodNotAllowed");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.json({
        message: "ok",
        routes: [
            "/user",
            "/user/:id",
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
        message: "An error occured",
    });
});
