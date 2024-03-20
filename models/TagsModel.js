const { default: mongoose, Schema } = require("mongoose");
const Collections = require("../utils/Collections");


const TagsSchema = new mongoose.Schema({
    tagName: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

})
TagsSchema.method = {}


module.exports = TagsModel = mongoose.model(Collections.TAGS_MODEL, TagsSchema);
