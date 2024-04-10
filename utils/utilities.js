const { ObjectId } = require("mongodb");

exports.GetObjectID = (id) => {
    return new ObjectId(id);
}


exports.BuildMessegeObject = (Message) => {
    return (
        {
            id: Message._id.toString(),
            message: Message.message,
            userName: Message.author.name,
            refId: Message.author.refId,
            seen: Message.seen,
            seenTime: Message.seenTime || '',
            attachments: Message.attachments,
            sentAt: Message.sendTime,
            type:Message.type,
        }
    )
}


exports.BuildGroupChatMessegeObject=(Message, groupId) =>{
    return {
        id: Message._id.toString(),
        message: Message.message,
        groupId: groupId,
        userName: Message.author.name,
        userId: Message.author.refId,
        seen: Message.seen,
        seenTime: Message.seenTime || "",
        attachments: Message.attachments,
        sentAt: Message.sendTime,
        type:Message.type,
    };
}
