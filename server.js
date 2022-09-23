require("dotenv").config();
const http = require("http");
const { app } = require("./server/index");

const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.json({ 
        message: "ok",
        routes: [
            "/drivers",
            "/clients",
            "/notifications",
            "/trucks",
            "/orders"
        ] 
    });
});
