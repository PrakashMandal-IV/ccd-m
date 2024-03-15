const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const channelController = require('../controllers/channelController')

router.post("/create",auth, channelController.createChannel)

module.exports = router;