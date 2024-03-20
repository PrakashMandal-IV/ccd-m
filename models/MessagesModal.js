const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");


const MessegesSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: Collections.USER_MODEL,
        required: true
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: Collections.CONVERSATION_MODEL
    },
    seen: {
        type: Boolean,
        trim: true,
        default: false,
    },
    type: {
        type: String,
        trim: true,
        default: 'TEXT'
    },
    seenTime: {
        type: Date,
        trim: true,
    },
    seenByGroup: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: Collections.USER_MODEL,
        },
        seenTime: {
            type: Date,
            trim: true,
            default: Date.now,
        }
    }],
    attachments: [{
        url: {
            type: String
        },
        name: {
            type: String
        },
        size: {
            type: Number
        },
        type: {
            type: String
        }
    }],
    sendTime: {
        type: Date,
        default: Date.now
    },
    messageTypeName: {
        type: String,
        default: '',
        trim: true
    },
    messageTypeID: {
        type: Schema.Types.ObjectId,
        default: null,
    }
})
MessegesSchema.method = {}


module.exports = MessegesModel = mongoose.model(Collections.MESSEGES_MODEL, MessegesSchema);
