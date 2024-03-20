const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const channelController = require('../controllers/channelController')

router.post("/create",auth, channelController.createChannel)
router.get("/getChannels",auth, channelController.getChannels)
router.patch("/addMember",auth, channelController.addMemberInChannel)
router.patch("/removeMember",auth, channelController.removeMemberInChannel)
router.delete("/:id",auth, channelController.deleteChannel)
router.get("/getChanneMessages/:channelId",auth, channelController.getChannelMessages)
module.exports = router;