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
        return res.error("Error occurred while creating user", error.message);
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

