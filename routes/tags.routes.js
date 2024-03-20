const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const tagsConroller = require('../controllers/channelController')

router.get("/getMyTags",auth, tagsConroller.getMyTags)

module.exports = router;