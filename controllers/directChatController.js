const ConversationModal = require("../models/ConversationModal");
const MessagesModal = require("../models/MessagesModal");
const { GetObjectID } = require("../utils/utilities");
const { getUserIdByRefId } = require("./userController");
const Collections = require("../utils/Collections");
exports.addMessageInConversation = async (userID, recieverRefId, data) => {
    try {
        var recieverId = await getUserIdByRefId(recieverRefId)
        if (userID && recieverId) {
            var ConversationID = await ConversationModal.findOne({
                type: "DIRECT_CHAT",
                participants: {
                    $all: [
                        GetObjectID(userID),
                        GetObjectID(recieverId)
                    ],
                },
            });
            if (!ConversationID) {  // if there is no conversation then crate one
                ConversationID = await createDirectMessageConversation(userID, recieverId)
            }
            // add message to the conversation
            const messagePayload = new MessagesModal({
                message: data.message,
                author: GetObjectID(userID),
                conversationId: ConversationID._id,
                attachments: [],
                type: data.type
            })
            const messageResponse = await messagePayload.save()

            const message = await MessagesModal.findById(messageResponse._id)
                .populate('author', 'name refId').exec()

            var mdata = BuildMessegeObject(message)
            return {
                participents: [userID, recieverId],
                data: mdata
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function createDirectMessageConversation(userID, recieverId) {
    const payload = new ConversationModal({
        type: "DIRECT_CHAT",
        participants: [
            GetObjectID(userID),
            GetObjectID(recieverId)
        ]
    })
    const conversation = await payload.save()
    return conversation
}

exports.getDirectChatHistory = async (req, res) => {
    try {
        const participentID = await getUserIdByRefId(req.params.refId)
        const conversation = await ConversationModal.findOne({
            type: "DIRECT_CHAT",
            participants: {
                $all: [
                    GetObjectID(req.userId),
                    GetObjectID(participentID)
                ],
            },
        });
        const response = []
        if (conversation) {
            const messageList = await MessagesModal.find({ conversationId: conversation._id })
                .populate('author', 'name refId').exec()
            messageList.forEach(item => {
                response.push(BuildMessegeObject(item))
            })
        }
        return res.success("Success", { data: response });
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}

exports.getDirectChatInbox = async (userID) => {
    try {
        const conversation = await ConversationModal.aggregate([
            {
                $match: {
                    type: "DIRECT_CHAT",
                    participants: {
                        $all: [GetObjectID(userID)],
                    },
                },
            },
            {
                $lookup: {
                    from: 'messages', // Replace with your actual collection name for messages
                    localField: "_id",
                    foreignField: "conversationId",
                    as: "messages",
                },
            },
            {
                $unwind: "$messages",
            },
            {
                $sort: {
                    "messages.sendTime": -1,
                },
            },
            {
                '$limit': 1
            },
            {
                $group: {
                    _id: "$_id",
                    conversation: { $first: "$$ROOT" },
                    lastMessage: { $first: "$messages" },
                },
            },
            {
                $lookup: {
                    from: 'user', // Replace with your actual collection name for users
                    localField: "lastMessage.author",
                    foreignField: "_id",
                    as: "lastMessage.author",
                },
            },
            {
                $unwind: "$lastMessage.author",
            },
            {
                $project: {
                    _id: "$conversation._id",
                    type: "$conversation.type",
                    lastMessage: {
                        message: "$lastMessage.message",
                        sendTime: "$lastMessage.sendTime",
                        author: {
                            refId: "$lastMessage.author.refId",
                            displayName: "$lastMessage.author.name",
                        },
                    },
                },
            },
        ]);
        console.log(conversation.length)
    } catch (error) {
        console.log(error)
    }
}








function BuildMessegeObject(Message) {
    return (
        {
            id: Message._id.toString(),
            message: Message.message,
            userName: Message.author.name,
            refId: Message.author.refId,
            seen: Message.seen,
            seenTime: Message.seenTime || '',
            attachments: Message.attachments,
            sentAt: Message.sendTime
        }
    )
}