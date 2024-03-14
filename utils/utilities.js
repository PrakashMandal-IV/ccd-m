const { ObjectId } = require("mongodb");

exports.GetObjectID=(id)=>{
    return new ObjectId(id);
}