const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");


const GroupSchema = new mongoose.Schema({
    groupName: {
        typw: String,
        require: true
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: Collections.USER_MODEL,
            require: true
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
    type: {
        type: String,
        trim: true, // just in case if user want to categorise groups
        default:''
    },
})
GroupSchema.method = {}


module.exports = GroupModel = mongoose.model(Collections.GROUPS_MODEL, GroupSchema);