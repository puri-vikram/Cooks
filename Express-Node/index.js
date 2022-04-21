const http = require("http");
const https = require("https");
const app = require("./app");
var fs = require('fs');

const server = https.createServer({
  key: fs.readFileSync('privkey.pem', 'utf8'),
  cert: fs.readFileSync('fullchain.pem', 'utf8'),
}, app
);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const BASE_IP = process.env.BASE_IP;

// server listening 
server.listen(port, BASE_IP, () => {
  console.log(`Server running on port ${port}`);
});