const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const conversationController = require('../controllers/directChatController')

router.get("/direct/getHistory/:refId",auth, conversationController.getDirectChatHistory)

module.exports = router;