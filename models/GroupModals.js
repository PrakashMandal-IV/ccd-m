const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");


const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        require: true
    },
    refId: {
        type: String,
        trim: true,
    },
    logo: {
        type: String,
        trim: true,
    },
    members: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: Collections.USER_MODEL,
                require: true
            },
            isAdmin: {
                type: Boolean,
                default: false
            }
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: Collections.USER_MODEL,
        require: true
    },
    type: {  // just in case if user want to categorise groups
        type: String,
        trim: true,
        default: ''
    },
})
GroupSchema.method = {}


module.exports = GroupModel = mongoose.model(Collections.GROUPS_MODEL, GroupSchema);
