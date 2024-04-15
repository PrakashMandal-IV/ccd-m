const notificationModel = require("../models/notificationModel");

exports.addNotification = async (userId, data) => {
    try {
        const notify = new notificationModel({
            content: data.content,
            type: data.Type,
            sentBy: userId,
            sentTo: data.to
        })
        await notify.save()
        return notify.toObject()
    } catch (error) {
        return false;
    }
}




