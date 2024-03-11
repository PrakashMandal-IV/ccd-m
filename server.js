const express = require("express");
const { init } = require("./middleware/middleware");
const { databaseConnection } = require("./middleware/DBConnection");

require("dotenv").config();


const app = express();

const PORT = 8000;
databaseConnection();
init(app);

app.listen(PORT, () => console.log('Listening on port :' + PORT))