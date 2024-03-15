


exports.createGroup = (req, res) => {
    try {
        const userId = req.userId  // person who sent the request
        const body = req.body// body


        return res.success("Success", true); 
    } catch {
        return res.error("Error occurred while creating group", error.message);
    }
}

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