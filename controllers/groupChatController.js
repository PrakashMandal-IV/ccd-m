const ConversationModal = require("../models/ConversationModal");
const GroupModals = require("../models/GroupModals");
const MessagesModal = require("../models/MessagesModal");
const UserModel = require("../models/UserModel");
const PushNotificationModel = require("../models/pushNotification");
const {
  GetObjectID,
  BuildGroupChatMessegeObject,
} = require("../utils/utilities");
const { getUserIdByRefId } = require("./userController");
const _ = require("lodash");
const Collections = require("../utils/Collections");


exports.createGroup = async (req, res) => {
  try {
    const { groupName, refId, logo, type } = req.body;
    const userId = req.userId;
    if (!groupName || !refId) {
      if (!groupName) {
        return res.error(
          "Error occurred while creating group",
          "Group name is required"
        );
      }
      if (!refId) {
        return res.error(
          "Error occurred while creating group",
          "Group refId is required"
        );
      }
    }

    const group = await GroupModals.findOne({ refId: refId });
    const fcmUser = await PushNotificationModel.findOne({ userId: userId });
    console.log('fcmUser', fcmUser)
    const fcm_token  = fcmUser.fcm_token;
    if (group) {
      return res.error(
        "Error occurred while creating group",
        "Group with same refId already exists"
      );
    }
    const payload = new GroupModals({
      groupName: groupName,
      refId: refId,
      logo: "",
      createdBy: GetObjectID(userId),
      members: [
        {
          userId: GetObjectID(userId),
          isAdmin: true,
          fcm_token: fcm_token
        },
      ],
      type: type || "",
    });

    await payload.save();
    return res.success("Success", true);
  } catch (error) {
    return res.error("Error occurred while creating group", error.message);
  }
};

exports.getGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const payload = await GroupModals.find({ createdBy: GetObjectID(userId) })
      .populate("members", "name refId logo") // Populate the members field with username and email
      .select("groupName members");
    var response = StructureGroupList(payload);
    return res.success("Success", response);
  } catch (error) {
    return res.error("Error occurred while fetching group", error.message);
  }
};

function StructureGroupList(groups) {
  var list = [];
  groups.forEach((element) => {
    list.push({
      id: element._id?.toString(),
      groupName: element.groupName,
      members: element.members.map((x) => {
        return {
          name: x.name,
          refId: x.refId,
          logo: x.logo,
        };
      }),
    });
  });
  return list;
}

exports.addMemberInGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const userId = req.userId;
    console.log('userId', userId)
    const member = await getUserIdByRefId(memberId);
    const group = await GroupModals.findOne({ refId: groupId });
    const fcmUser = await PushNotificationModel.findOne({ userId: userId });
    console.log('fcmUser', fcmUser)
    const fcm_token  = fcmUser.fcm_token;
    let groupDetails = group;
    if (groupDetails) {
      const members = groupDetails.members;
      var exists = false;
      members.forEach((x) => {
        if (x.userId._id?.toString() === member.toString()) {
          exists = true;
        }
      });
      if (!exists) {
        members.push({
          userId: member,
          fcm_token: fcm_token
        });
      } else {
        return res.success("Member already exist", true);
      }

      await GroupModals.findByIdAndUpdate(
        groupDetails._id,
        { $set: { members: members } },
        { new: true }
      );
      return res.success("Success", true);
    } else {
      if (!group) {
        return res.error("Error", "Channel not found");
      } else {
        return res.error("Error", "User not found");
      }
    }
  } catch (error) {
    return res.error("Error occurred while adding member", error.message);
  }
};

exports.removeMemberInGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;
    const member = await getUserIdByRefId(memberId);
    const group = await GroupModals.findOne({ refId: groupId });
    if (group) {
      var members = group.members;
      var exists = false;

      // Check if the member to be removed exists in the group's members array
      members.forEach((x) => {
        if (x.userId._id?.toString() === member.toString()) {
          exists = true;
        }
      });

      if (exists) {
        // Filter out the member to be removed from the members array
        members = members.filter(
          (x) => x.userId._id?.toString() !== member.toString()
        );
      } else {
        return res.success("Member does not exist in the group", true);
      }

      // Update the group with the new members array
      await GroupModals.findByIdAndUpdate(
        group._id,
        { $set: { members: members } },
        { new: true }
      );

      return res.success("Member removed successfully", true);
    } else {
      return res.error("Error", "Group not found");
    }
  } catch (error) {
    return res.error("Error occurred while removing member", error.message);
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const groupId = req.params.id;
    const group = await GroupModals.findById(groupId);
    if (!group) {
      return res.error("Error", "group not found");
    }
    if (group.createdBy._id?.toString() !== userId) {
      // if group is not created by this user
      return res.error(
        "Error",
        "Not authorized to make changes for this group"
      );
    } else {
      await GroupModals.findByIdAndDelete(groupId);
      return res.success("Success", true);
    }
  } catch (error) {
    return res.error("Error occurred while deleting group", error.message);
  }
};

exports.getMembersRefIdofGroup = async (userId, groupId) => {
  try {
    const group = await GroupModals.findById(groupId);
    if (group) {
      if (group.createdBy._id?.toString() !== userId) {
        // if group is not created by this user
        return { status: false, data: "unauthorize" };
      }
      var members = [];
      await Promise.all(
        group.members.map(async (member) => {
          let user = await UserModel.findById(member).select("refId");
          members.push(user.refId);
        })
      );

      return { status: true, data: members };
    }
  } catch {
    return { status: false, data: "something went wrong" };
  }
};

exports.sendGroupMessage = async (userId, data) => {
  try {
    const group = await GroupModals.findOne({ refId: data.groupId });
    if (group) {
      var exists = false;
      group.members.map((member) => {
        if (member.userId.toString() === userId) {
          exists = true;
          return;
        }
      });
      var ConversationID = await ConversationModal.findOne({
        type: "GROUP_CHAT",
        groupId: group._id,
      });
      if (!ConversationID) {
        ConversationID = await createDirectMessageConversation(group._id);
      }
      // add message to the conversation
      const messagePayload = new MessagesModal({
        message: data.message,
        author: GetObjectID(userId),
        conversationId: ConversationID._id,
        attachments: data.attachments,
        type: data.type,
      });
      const messageResponse = await messagePayload.save();

      const message = await MessagesModal.findById(messageResponse._id)
        .populate("author", "name refId")
        .exec();

      var mdata = BuildGroupChatMessegeObject(message, data.groupId);
      return {
        participents: group.members.map((item) => item.userId._id),
        data: mdata,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

async function createDirectMessageConversation(groupId) {
  const payload = new ConversationModal({
    type: "GROUP_CHAT",
    groupId: groupId,
  });
  const conversation = await payload.save();
  return conversation;
}

exports.getGroupChatInbox = async (userID) => {
  try {
    const groups = await GroupModals.find({ "members.userId": userID });
    let members = groups.map((group) => group._id.toString()); // Convert ObjectIds to strings

    var conversations = await Promise.all(
      members.map(async (groupId) => {
        const groupDetails = await GroupModals.findById(groupId).select(
          "groupName logo refId members type"
        );
        const conversation = await ConversationModal.find({
          type: "GROUP_CHAT",
          groupId: groupId,
        });
        if (conversation && conversation.length > 0) {
          const lastMessage = await MessagesModal.findOne({
            conversationId: conversation[0]._id,
          })
            .sort({ sendTime: -1 })
            .populate("author", "name refId logo")
            .exec();

          if (lastMessage) {
           
            const unReadCount = await MessagesModal.countDocuments({
              conversationId: conversation[0]._id,
              author: { $ne: GetObjectID(userID) },
              seenByGroup: {
                $not: {
                  $elemMatch: { userId: GetObjectID(userID) },
                },
              },
            });
          
            const userId = GetObjectID(userID).toString(); 
           
            const seen = Array.from(lastMessage.seenByGroup).find(
              (x) => x.userId.toString() === userId
            )
              ? true
              : false;

            
            const formattedData = {
              groupName: groupDetails.groupName,
              participants: [],
              memberCount: groupDetails.members.length,
              type: groupDetails.type,
              logo: groupDetails.logo,
              refId: groupDetails.refId,
              sendByName: lastMessage.author.name,
              sendByrefId: lastMessage.author.refId,
              lastMessage: lastMessage.message,
              lastMessageTime: lastMessage.sendTime,
              seen: seen,
              sendBylogo: lastMessage.author.logo,
              unRead: unReadCount,
            };
            return formattedData;
          }
        } else {
          const formattedData = {
            groupName: groupDetails.groupName,
            participants: [],
            memberCount: groupDetails.members.length,
            type: groupDetails.type,
            logo: groupDetails.logo,
            refId: groupDetails.refId,
            sendByName: "",
            sendByrefId: "",
            lastMessage: "",
            lastMessageTime: "",
            seen: false,
            sendBylogo: "",
          };
          return formattedData;
        }
      })
    );

    conversations = _.map(
      _.sortBy(conversations, (o) => Date.parse(o.lastMessageTime))
    );
    return conversations.reverse();
  } catch (error) {
    console.log(error);
  }
};

exports.getGroupChatHistory = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await GroupModals.findOne({ refId: groupId });
    const conversation = await ConversationModal.findOne({
      type: "GROUP_CHAT",
      groupId: group._id,
    });

    const response = [];
    if (conversation) {
      const messageList = await MessagesModal.find({
        conversationId: conversation._id,
      })
        .populate("author", "name refId")
        .exec();
      messageList.forEach((item) => {
        response.push(BuildGroupChatMessegeObject(item));
      });
    }

    // console.log('response', response);
    return res.success("Success", { data: response });
  } catch (error) {
    return res.error("Error occurred while creating user", error.message);
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const members = await GroupModals.aggregate([
      {
        $match: { refId: groupId }, // Filter by the desired group
      },
      {
        $unwind: "$members", // Unwind the members array
      },
      {
        $lookup: {
          from: "users",
          localField: "members.userId",
          foreignField: "_id",
          as: "memberInfo",
        },
      },
      {
        $unwind: "$memberInfo", // Unwind the memberInfo array
      },
      {
        $project: {
          refId: "$memberInfo.refId",
          name: "$memberInfo.name",
          logo: "$memberInfo.logo",
          email: "$memberInfo.email",
          isAdmin: "$members.isAdmin",
        },
      },
    ]);

    return res.success("Success", { data: members });
  } catch (error) {
    return res.error("Error occurred while creating user", error.message);
  }
};

exports.setMessageSeen = async (messageId, userId) => {
  try {
    const message = await MessagesModal.findById(GetObjectID(messageId)).exec();
    var seenByGroup = message.seenByGroup;
    if (
      !Array.from(seenByGroup).find((x) => x.userId === GetObjectID(userId))
    ) {
      seenByGroup.push({
        userId: GetObjectID(userId),
        seenTime: Date.now(),
      });
    }
    await message.updateOne({ $set: { seenByGroup: seenByGroup } });
  } catch (error) {
    console.error(error);
  }
};
