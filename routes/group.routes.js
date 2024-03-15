const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const groupController = require('../controllers/groupChatController')

router.post("/createGroup",auth, groupController.createGroup)

module.exports = router;