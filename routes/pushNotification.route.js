const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const pushNotificationController = require('../controllers/pushNotificationController')

router.post("/postfcmtoken",auth, pushNotificationController.recievefcmToken)
module.exports = router;