const ChannelModel = require("../models/ChannelModel");
const UserModel = require("../models/UserModel");
const { GetObjectID } = require("../utils/utilities");
const MessagesModal = require("../models/MessagesModal");
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
        return res.error("Error occurred while creating channel", error.message);
    }
}

exports.getChannels = async (req, res) => {
    try {
        const userId = req.userId;
        const payload = await ChannelModel.find({ createdBy: GetObjectID(userId) })
            .populate('members', 'name refId logo') // Populate the members field with username and email
            .select('channelName members');
        var response = StructureChannelList(payload)
        return res.success("Success", response);
    } catch (error) {
        return res.error("Error occurred while fetching channel", error.message);
    }
}

function StructureChannelList(channels) {
    var list = []
    channels.forEach(element => {
        list.push({
            id: element._id?.toString(),
            channelName: element.channelName,
            members: element.members.map(x => {
                return ({
                    name: x.name,
                    refId: x.refId,
                    logo: x.logo
                })
            })
        })
    });
    return list;
}

exports.addMemberInChannel = async (req, res) => {
    try {
        const userId = req.userId;
        const { channelId, memberRefId } = req.body;
        const channel = await ChannelModel.findById(channelId)

        const MemberData = await UserModel.findOne({ refId: memberRefId })
        if (channel && MemberData) {
            if (channel.createdBy._id?.toString() !== userId) {  // if channel is not created by this user
                return res.error("Error", "Not authorized to make changes for this channel");
            }
            const members = channel.members
            var exists = false
            members.forEach(x => {
                if (x._id?.toString() === MemberData._id.toString()) {
                    exists = true
                }
            })
            if (!exists) {
                members.push(MemberData._id)
            } else {
                return res.success("Member already exists", true);
            }
            await ChannelModel.findByIdAndUpdate(
                channelId,
                { $set: { members: members } },
                { new: true }
            );
            return res.success("Success", true);
        } else {
            if (!channel) {
                return res.error("Error", "Channel not found");
            } else {
                return res.error("Error", "User not found");
            }
        }
    } catch (error) {
        return res.error("Error occurred while adding member", error.message);
    }
}

exports.removeMemberInChannel = async (req, res) => {
    try {
        const userId = req.userId;
        const { channelId, memberRefId } = req.body;
        const channel = await ChannelModel.findById(channelId)

        const MemberData = await UserModel.findOne({ refId: memberRefId })
        if (channel && MemberData) {
            if (channel.createdBy._id?.toString() !== userId) {  // if channel is not created by this user
                return res.error("Error", "ot authorized to make changes for this channel");
            }
            var members = channel.members
            var exists = false
            members.forEach(x => {
                if (x._id?.toString() === MemberData._id.toString()) {
                    exists = true
                }
            })
            if (exists) {
                members = members.filter(x => x._id?.toString() !== MemberData._id.toString())
            } else {
                return res.success("Member already exists", true);
            }
            await ChannelModel.findByIdAndUpdate(
                channelId,
                { $set: { members: members } },
                { new: true }
            );
            return res.success("Success", true);
        } else {
            if (!channel) {
                return res.error("Error", "Channel not found");
            } else {
                return res.error("Error", "User not found");
            }
        }
    } catch (error) {
        return res.error("Error occurred while removing member", error.message);
    }
}


exports.getMembersRefIdofChannel = async (userId, channelId,data) => {

    try {
        const channel = await ChannelModel.findById(channelId)
        if (channel) {
            if (channel.createdBy._id?.toString() !== userId) {  // if channel is not created by this user
                return { status: false, data: 'unauthorize' }
            }
            var members = []
            await Promise.all(channel.members.map(async (member) => {
                let user = await UserModel.findById(member).select('refId')
                members.push(user.refId)
            }));


            // add message for the channel 
            const messagePayload = new MessagesModal({
                message: data.message,
                author: GetObjectID(userId),
                conversationId: null,
                attachments: data?.attachments||[],
                type: data.type,
                messageTypeName:'CHANNEL_TYPE',
                messageTypeID:channel._id
              })
              await messagePayload.save()

            return { status: true, data: members };
        }
    } catch(error) {
        console.log(error)
        return { status: false, data: 'something went wrong' }
    }
}

exports.deleteChannel = async (req, res) => {
    try {
        const userId = req.userId;
        const channelId = req.params.id;
        const channel = await ChannelModel.findById(channelId)
        if (!channel) {
            return res.error("Error", "channel not found");
        }
        if (channel.createdBy._id?.toString() !== userId) {  // if channel is not created by this user
            return res.error("Error", "Not authorized to make changes for this channel");
        } else {
            await ChannelModel.findByIdAndDelete(channelId);
            return res.success("Success", true);
        }


    } catch (error) {
        return res.error("Error occurred while deleting channel", error.message);
    }
}
