const _ = require("lodash");
const ConversationModal = require("../models/ConversationModal");
const MessagesModal = require("../models/MessagesModal");
const { GetObjectID, BuildMessegeObject } = require("../utils/utilities");
const { getUserIdByRefId } = require("./userController");
const Collections = require("../utils/Collections");
const UserModel = require("../models/UserModel");
exports.addMessageInConversation = async (userID, recieverRefId, data, type, typeId) => {
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
        const user = await UserModel.findById(userID)

        let friends = user.friends;
        if (!friends.includes(recieverId)) {
          friends.push(recieverId);
        }
        const recieverUser = await UserModel.findById(recieverId)
        let participantFriends = recieverUser.friends;
        if (!participantFriends.includes(userID)) {
          participantFriends.push(userID);
        }
        await UserModel.findByIdAndUpdate(
          userID,
          { $set: { friends } },
          { new: true }
        );
        await UserModel.findByIdAndUpdate(
          recieverId,
          { $set: { friends: participantFriends } },
          { new: true }
        );
        ConversationID = await createDirectMessageConversation(userID, recieverId)
      }
      // add message to the conversation
      const messagePayload = new MessagesModal({
        message: data.message,
        author: GetObjectID(userID),
        conversationId: ConversationID._id,
        attachments:data.attachments,
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
    const user = await UserModel.findById(userID);
    let friends = user.friends.map((friend) => friend.toString()); // Convert ObjectIds to strings

    var conversations = await Promise.all(
      friends.map(async (friendID) => {
        const friend = await UserModel.findById(friendID).select('name logo refId')
        const conversation = await ConversationModal.aggregate([
          {
            $match: {
              type: "DIRECT_CHAT",
              participants: {
                $all: [GetObjectID(userID), GetObjectID(friendID)],
              },
            },
          },
        ]);
        if (conversation && conversation.length > 0) {
          const lastMessage = await MessagesModal.findOne({
            conversationId: conversation[0]._id,
          })
            .sort({ sendTime: -1 })
            .populate("author", "name refId logo")
            .exec();

          if (lastMessage) {
            const formattedData = {
              userName: friend.name,
              logo: friend.logo,
              refId: friend.refId,
              sendByName: lastMessage.author.name,
              sendByrefId: lastMessage.author.refId,
              lastMessage: lastMessage.message,
              lastMessageTime: lastMessage.sendTime,
              seen: lastMessage.seen,
              sendBylogo: lastMessage.author.logo
            };
            return formattedData;
          }
        }
      })
    );
    conversations = _.map(
      _.sortBy(conversations, o => Date.parse(o.lastMessageTime))
    );
    return conversations.reverse();
  } catch (error) {
    console.log(error);
  }
};






