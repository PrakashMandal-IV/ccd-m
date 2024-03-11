const express = require("express");
const { init } = require("./middleware/middleware");

require("dotenv").config();


const app = express();

const PORT = 8000;

init(app);

app.listen(PORT, () => console.log('Listening on port :' + PORT))