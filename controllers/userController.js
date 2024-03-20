
const TagsModel = require("../models/TagsModel");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

exports.userLogin = async (req, res) => {
    try {

        const user = req.body
        var User = await UserModel.findOne({ email: user.email }, 'name email logo refId').exec() // find is user exist or not
        if (!User) {
            User = await createUser(user)  // create user if not exist
        }
        var result = await GenerateUserToken({ _id: User._id })

        return res.success("Success", result);

    } catch (error) {
        return res.error("Error occurred while updating user", error.message);
    }
}

const GenerateUserToken = async (user) => {
    try {
        user.userId = user._id;
        const token = jwt.sign(user, process.env.TOKEN_KEY, { expiresIn: "24h" });
        user.token = token;
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

async function createUser(user) {
    var Tags = []
    if (user.tags) {

        Tags = user.tags.split(',')
        Tags = await UpdateTags(Tags)

    }
    const userdata = new UserModel({
        name: user.name,
        email: user.email,
        refId: user.refId,
        logo: user?.logo || '',
        password: user.password,
        tags: Tags
    }).save()

    return userdata
}

async function UpdateTags(Tags) {
    const tags = await Promise.all(Tags.map(async (tag) => {
        if (!tag.startsWith('#')) {
            tag = "#" + tag.replace(' ', '')
        }
        const exists = await TagsModel.findOne({ tagName: tag })
        // if not exists
        if (!exists) {
            const tags = new TagsModel({
                tagName: tag
            })
            await tags.save()
        }
        return tag
    }))

    return tags
}

exports.updateUserData = async (req, res) => {
    try {
        const { email, name, logo, tags } = req.body
        const userId = req.userId;
        const exsits = await UserModel.exists({
            _id: { $ne: userId },
            email: email
        })
        if (!exsits) {
            var updateData = {
                email: email,
                logo: logo,
                name: name
            }
            if (tags) {
                var Tags = tags?.split(',')
                Tags = await UpdateTags(Tags)
                updateData.tags=Tags
            }
            await UserModel.findByIdAndUpdate(
                { _id:userId }, 
                {
                    $set: updateData
                }
            )
        }
        return res.success("Success", true);
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}

exports.getMyTags = async (req, res) => {
    try {
       
        const userId = req.userId;
        const user = await UserModel.findById(userId)

        return res.success("Success", user.tags?.toString());
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { password } = req.body
        const userId = req.userId;
        if (password) {
            await UserModel.findByIdAndUpdate(
                { _id:userId}, // Filter by userId
                {
                    $set: {
                        password: password
                    }
                }// Update the email field
            )
            return res.success("Success", true);
        } else {
            return res.error("Password cannot be empty");
        }
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}

exports.getUserIdByRefId = async (refId) => {
    try {
        const ID = await UserModel.findOne({ refId: refId }).select('_id')
        return ID._id.toString()
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}




