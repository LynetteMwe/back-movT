const http = require('http')
const app = require('./index')

const port = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(port, ()=>{
 console.log(`Listening at http://localhost:${port}`)
})

app.get('/', (req, res)=>{
 res.json({"message":"ok"})
})