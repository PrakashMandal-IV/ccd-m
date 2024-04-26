const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");

const PushNotificationSchema = new mongoose.Schema({
  fcm_token: {
    type: String,
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: Collections.USER_MODEL,
    require: true,
  },
});
PushNotificationSchema.method = {};

module.exports = PushNotification = mongoose.model(
  Collections.PUSHNOTIFICATION_MODEL,
  PushNotificationSchema
);
