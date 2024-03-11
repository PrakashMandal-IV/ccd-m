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
    password: {
        type: String,
        required: true,
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})
UserSchema.method = {}


module.exports = UserModel = mongoose.model(Collections.USER_MODEL, UserSchema);
