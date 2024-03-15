const express = require("express");
const router = express.Router()

const UserRoute = require('./routes/user.routes')
const ConversationRoute = require('./routes/conversation.routes')
const GroupsRoute = require('./routes/group.routes')
const ChannelRoutes = require('./routes/channel.routes')

router.use('/users', UserRoute);
router.use('/chat', ConversationRoute);
router.use('/group', GroupsRoute);
router.use('/channel', ChannelRoutes);


module.exports = router;