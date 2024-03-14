const express = require("express");
const router = express.Router()

const UserRoute = require('./user.routes')
const ConversationRoute = require('./conversation.route')


router.use('/users', UserRoute);
router.use('/chat', ConversationRoute);


module.exports = router;