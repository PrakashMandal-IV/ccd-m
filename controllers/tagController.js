
const TagsModel = require("../models/TagsModel");
const UserModel = require("../models/UserModel");



exports.getMyTags = async (req, res) => {
    try {
       
        const userId = req.userId;
        const user = await UserModel.findById(userId)

        return res.success("Success", user.tags?.toString());
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}




