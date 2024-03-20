
const MessagesModal = require("../models/MessagesModal");
const TagsModel = require("../models/TagsModel");
const UserModel = require("../models/UserModel");
const { GetObjectID } = require("../utils/utilities");



exports.getMyTags = async (req, res) => {
    try {

        const userId = req.userId;
        const user = await UserModel.findById(userId)

        return res.success("Success", user.tags?.toString());
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}

exports.getMembersFortheTags = async (userId, tag, data) => {

    try {
        if (!tag.startsWith('#')) {
            tag = "#" + tag
        }
        const Tag = await TagsModel.findOne({ tagName: tag })
        if (Tag) {

            var members = await UserModel.find({ tags: { $all: tag }, _id: { $ne: GetObjectID(userId) } }).select('refId')
            members = members.map(x => x.refId)



           // add message for the channel 
            const messagePayload = new MessagesModal({
                message: data.message,
                author: GetObjectID(userId),
                conversationId: null,
                attachments: data?.attachments || [],
                type: data.type,
                messageTypeName: 'TAG_TYPE',
                messageTypeID: tag._id
            })
            await messagePayload.save()

            return { status: true, data: members };
        }
    } catch (error) {
        console.log(error)
        return { status: false, data: 'something went wrong' }
    }
}


