const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
exports.userLogin = async (req, res) => {
    try {

        const user = req.body
        var User = await UserModel.findOne({ email: user.email }, 'name email logo refId ').exec() // find is user exist or not
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
    const userdata = new UserModel({
        name: user.name,
        email: user.email,
        refId: user.refId,
        logo: user?.logo || '',
        password: user.password
    })
    const result = await userdata.save()
    return result
}

exports.updateUserData = async (req, res) => {
    try {
        const { email, name, logo } = req.body
        const userId = req.userId;
        const exsits = await UserModel.exists({
            _id: { $ne: userId },
            email: email
        })
        if (!exsits) {
            await UserModel.findOneAndUpdate(
                { _id: userId }, // Filter by userId
                {
                    $set: {
                        email: email,
                        logo: logo,
                        name: name
                    }
                }// Update the email field
            )
        }
        return res.success("Success", true);
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}


exports.changePassword = async (req, res) => {
    try {
        const { password } = req.body
        const userId = req.userId;
        if (password) {
            await UserModel.findOneAndUpdate(
                { _id: userId }, // Filter by userId
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




