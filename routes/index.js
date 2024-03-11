const express = require("express");
const router = express.Router()

const UserRoute = require('./user.routes')



router.use('/users', UserRoute);


module.exports = router;