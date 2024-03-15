


exports.createGroup = (req, res) => {
    try {
        const userId = req.userId  // person who sent the request
        const body = req.body// body


        return res.success("Success", true); 
    } catch {
        return res.error("Error occurred while creating group", error.message);
    }
}
