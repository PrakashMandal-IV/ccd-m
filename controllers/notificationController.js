
const notificationModel = require("../models/notificationModel");
const { getUserIdByRefId } = require("./userController");

exports.addNotification = async (userId, data) => {
    try {
        const sentTo =await getUserIdByRefId(data.to)
        const notify = new notificationModel({
            content: data.content,
            type: data.Type,
            sentBy: userId,
            sentTo: sentTo
        })
        await notify.save()
        return {
            data:notify.toObject(),
            to:sentTo
        }
    } catch (error) {
        return false;
    }
}




