const express = require("express");

const router = express.Router()
const auth = require("../middleware/auth");

const userController = require('../controllers/userController')

router.post("/login", userController.userLogin)
router.patch("/updateUser",auth, userController.updateUserData)
router.patch("/changePassword",auth, userController.changePassword)

module.exports = router;