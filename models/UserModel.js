const { default: mongoose } = require("mongoose");
const Collections = require("../utils/Collections");


const UserSchema = new mongoose.Schema({
    refId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    friends: [{
        trim: true,
        ref: Collections.USER_MODEL,
        type: mongoose.Types.ObjectId,
    }],
    createdOn: {
        type: Date,
        default: Date.now
    },
    tags: [
        {
            type: String,
            trim: true,
            default: ''
        }
    ]
})
UserSchema.method = {}


module.exports = UserModel = mongoose.model(Collections.USER_MODEL, UserSchema);
