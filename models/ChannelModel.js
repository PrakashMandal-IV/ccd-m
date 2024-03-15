const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");


const ChannelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        trim: true
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: Collections.USER_MODEL,
            require: true
        },
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: Collections.USER_MODEL,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

})
ChannelSchema.method = {}


module.exports = ChannelModel = mongoose.model(Collections.CHANNELS_MODEL, ChannelSchema);
