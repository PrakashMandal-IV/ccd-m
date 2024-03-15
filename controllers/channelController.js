const ChannelModel = require("../models/ChannelModel");
const { GetObjectID } = require("../utils/utilities");


exports.createChannel = async (req, res) => {
    try {
        const { channelName } = req.body
        const userId = req.userId;
        const payload = new ChannelModel({
            channelName: channelName,
            createdBy: GetObjectID(userId),
            members: []
        })
        await payload.save();
        return res.success("Success", true);
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}