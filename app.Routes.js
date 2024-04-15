const express = require("express");
const router = express.Router()

const UserRoute = require('./routes/user.routes')
const ConversationRoute = require('./routes/conversation.routes')
const GroupsRoute = require('./routes/group.routes')
const ChannelRoutes = require('./routes/channel.routes')
const TagsRoutes = require('./routes/tags.routes')
const NotificationRoutes = require('./routes/notification.routes')
router.use('/users', UserRoute);
router.use('/chat', ConversationRoute);
router.use('/group', GroupsRoute);
router.use('/channel', ChannelRoutes);
router.use('/tags', TagsRoutes);
router.use('/notification', NotificationRoutes);

module.exports = router;