const ConversationModal = require("../models/ConversationModal");
const MessagesModal = require("../models/MessagesModal");
const { GetObjectID } = require("../utils/utilities");
const { getUserIdByRefId } = require("./userController");

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
            const messageResponse =await messagePayload.save()

            const message  =await MessagesModal.findById(messageResponse._id)
            .populate('author', 'name refId').exec()

            var mdata = BuildMessegeObject(message)
            return {
                participents:[userID,recieverId],
                data:mdata
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



function BuildMessegeObject(Message){
   return (
    {
        message: Message.message,
        userName:Message.author.name,
        refId:Message.author.refId,
        seen:Message.seen,
        seenTime:Message.seenTime||'',
        attachments:Message.attachments
    }
   )
}