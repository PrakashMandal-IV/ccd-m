const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");


const NotificationSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true,
        trim: true,
    },
    notificationType: {
        type: String,
        default:''
    },
    subType: {
        type: String,
        default:''
    },
    sentBy: {
        type: Schema.ObjectId,
        ref: Collections.USER_MODEL,
        require: true
    },
    sentTo: {
        type: Schema.ObjectId,
        ref: Collections.USER_MODEL,
        require: true
    },
    sentAt: {
        type: Date,
        default: Date.now()
    },
    isSeen: {
        type: Boolean,
        default: false
    }
})
NotificationSchema.method = {}


module.exports = NotificationModal = mongoose.model(Collections.NOTIFICATION_MODEL, NotificationSchema);
