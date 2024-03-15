const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");


const ConversationSchema = new mongoose.Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: Collections.USER_MODEL,
            require: true
        },
    ],
    type: {
        type: String,
        trim: true,
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: Collections.GROUPS_MODEL
    }
})
ConversationSchema.method = {}


module.exports = ConversationModal = mongoose.model(Collections.CONVERSATION_MODEL, ConversationSchema);
