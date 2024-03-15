const express = require("express");
const router = express.Router()

const UserRoute = require('./routes/user.routes')
const ConversationRoute = require('./routes/conversation.routes')


router.use('/users', UserRoute);
router.use('/chat', ConversationRoute);
router.use('/group', ConversationRoute);


module.exports = router;