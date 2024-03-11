
exports.userLogin = async (req, res) => {
    try {
        console.log(req?.body)
        return res.success("User Response", req?.body);
    } catch (error) {
        return res.error("Error occurred while creating user", error.message);
    }
}