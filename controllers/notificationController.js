const notificationModel = require("../models/notificationModel");
const { BuildNotificationObject } = require("../utils/utilities");
const { getUserIdByRefId } = require("./userController");

exports.addNotification = async (userId, data) => {
  try {
    const sentTo = await getUserIdByRefId(data.to);
    const notify = new notificationModel({
      content: data.content,
      notificationType: data.notificationType,
      type: data.type,
      subType: data.subType,
      sentBy: userId,
      sentTo: sentTo,
    });
    await notify.save();
    return {
      data: notify.toObject(),
      to: sentTo,
    };
  } catch (error) {
    return false;
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notificationType = req.params.n_type;
    var filter = { sentTo: userId };
    if (notificationType !== "all") {
      filter = { sentTo: userId, notificationType: notificationType };
    }
    const list = await notificationModel
      .find(filter)
      .populate("sentBy", "name refId")
      .exec();
    var response = [];
    list.forEach((item) => {
      response.push(BuildNotificationObject(item));
    });
    console.log("list", list);
    return res.success("Success", response);
  } catch (error) {
    return res.error(
      "Error occurred while fetching notification",
      error.message
    );
  }
};
