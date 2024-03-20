const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const tagsConroller = require('../controllers/tagController')

router.get("/getMyTags",auth, tagsConroller.getMyTags)
router.get("/getMyMessages/:tag",auth, tagsConroller.getTagMessages)
module.exports = router;