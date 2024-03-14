const express = require("express");
const { init } = require("./middleware/middleware");
const { databaseConnection } = require("./middleware/DBConnection");
const http = require("http");
require("dotenv").config();
const socketServer = require("./socketServer");

const app = express();

const PORT = 8000;
databaseConnection();
init(app);
const server = http.createServer(app);

socketServer.registerSocketServer(server);


server.listen(PORT, () => console.log('Listening on port :' + PORT))