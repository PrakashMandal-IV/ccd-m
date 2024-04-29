const FCM = require("fcm-node/lib/fcm");
const GroupModals = require("../models/GroupModals");
const pushNotification = require("../models/pushNotification");
const fs = require("fs");
const path = require("path");
const UserModel = require("../models/UserModel");

exports.recievefcmToken = async (req, res) => {
  try {
    const userId = req.userId;
    const fcm_token = req.body.value;
   

    // Check if the FCM token already exists for the user
    const existingToken = await pushNotification.findOne({ userId: userId });
   

    if (existingToken) {
      // If FCM token already exists, update it
      existingToken.fcm_token = fcm_token;
      await existingToken.save();
     
    } else {
      // If FCM token doesn't exist, create a new entry
      const notify = new pushNotification({
        fcm_token: fcm_token,
        userId: userId,
      });
      await notify.save();
    }

    return res.success("Success", true);
  } catch (error) {
    console.error("Error saving/retrieving FCM token:", error);
    return res.error("Error occurred while handling FCM token", error.message);
  }
};

exports.sendPushNotification = async (data) => {
  try {
    let responsedata = JSON.stringify(data);
    let parseData = JSON.parse(responsedata);
    console.log("Sending push notification", parseData);

    fs.readFile(
      path.join(__dirname, "../FireBaseConfig.json"),
      "utf8",
      async (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return err;
        }
        try {
          //firebase push notification send
          const serverKeyData = JSON.parse(jsonString);
          //   let serverKey;
          //   if (data.type === "USER") {
          //     serverKey = serverKeyData.VENDOR_KEY;
          //   } else {
          //     serverKey = serverKeyData.USER_KEY;
          //   }

          // console.log("serverKeyData", serverKeyData);
          if (serverKeyData.length > 0) {
            serverKeyData?.map(async (value) => {
              var fcm = new FCM(value.SERVER_KEY);
              let refID = parseData?.userId || parseData?.refId;
              const user = await UserModel.findOne({ refId: refID });
              

              await sendPushNotificationToGroup(parseData, user, fcm);

              await sendPushNotificationToPerson(parseData, user, fcm);

              // if (pushMessage.length > 0) {
              //   console.log("regids", pushMessage);
              //   // var pushMessage = {
              //   //   //this may vary according to the message type (single recipient, multicast, topic, et cetera)

              //   //   registration_ids: reg_ids,
              //   //   content_available: true,
              //   //   mutable_content: true,
              //   //   notification: {
              //   //     title: group.groupName,
              //   //     body: parseData.message,
              //   //     icon: "myicon",
              //   //     sound: "mySound",
              //   //   },
              //   //   // data: {
              //   //   //   notification_type: 5,
              //   //   //   conversation_id:inputs.user_id,
              //   //   // }
              //   // };
              //   // console.log("pushMessage:", pushMessage);

              //   fcm.send(pushMessage, function (err, response) {
              //     if (err) {
              //       console.log("Something has gone wrong!", err);
              //     } else {
              //       console.log("Push notification sent.", response);
              //     }
              //   });
              // }
            });
          }
        } catch (err) {
          console.log("Error parsing JSON string:", err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

async function sendPushNotificationToGroup(parseData, user, fcm) {
  const group = await GroupModals.findOne({
    refId: parseData.groupId,
  });
  if (!group) {
    return null;
  }
  console.log("group", group);
  let groupMembers = group.members;

  const otherMembers = groupMembers.filter(
    (member) => member.userId.toString() !== user._id.toString()
  );
  if (otherMembers) {
    var reg_ids = [];
    otherMembers.forEach((token) => {
      reg_ids.push(token.fcm_token);
    });

    if (reg_ids.length > 0) {
      var pushMessage = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)

        registration_ids: reg_ids,
        content_available: true,
        mutable_content: true,
        notification: {
          title: group.groupName,
          body: parseData.message,
          icon: "myicon",
          sound: "mySound",
        },
        // data: {
        //   notification_type: 5,
        //   conversation_id:inputs.user_id,
        // }
      };
      fcm.send(pushMessage, function (err, response) {
        if (err) {
          console.log("Something has gone wrong!", err);
        } else {
          console.log("Push notification sent.", response);
        }
      });
    }
  }

}

async function sendPushNotificationToPerson(parseData, user, fcm) {
  if (parseData.hasOwnProperty("groupId")) {
    // If it does, return from here
    return;
  }
  const othermember = await pushNotification.findOne({
    userId: user.friends.toString(),
  });
  if (othermember) {
    var reg_ids = [];

    reg_ids.push(othermember.fcm_token);

    var pushMessage = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)

      registration_ids: reg_ids,
      content_available: true,
      mutable_content: true,
      notification: {
        title: user.name,
        body: parseData.message,
        icon: "myicon",
        sound: "mySound",
      },
      // data: {
      //   notification_type: 5,
      //   conversation_id:inputs.user_id,
      // }
    };

    fcm.send(pushMessage, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!", err);
      } else {
        console.log("Push notification sent.", response);
      }
    });
  }
}
