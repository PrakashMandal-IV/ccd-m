const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const groupController = require('../controllers/groupChatController')

router.post("/createGroup",auth, groupController.createGroup)
router.get("/getGroup",auth, groupController.getGroup)
router.post("/addMemberinGroup",auth, groupController.addMemberInGroup)
router.patch("/removeMemberFromGroup",auth, groupController.removeMemberInGroup)
router.delete("/:id",auth, groupController.deleteGroup)


module.exports = router;