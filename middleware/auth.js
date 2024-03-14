const jwt = require("jsonwebtoken");
const UserModal = require("../models/UserModel");

const verifyToken = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    token = token.replace(/^Bearer\s+/, ""); // if token is not passed through authorization header and has no Bearer then this line of code will not affect anything
    const decoded = jwt.verify(token,  process.env.TOKEN_KEY);
    req.userId = decoded.userId;
    if (decoded.userId) {
      req.user = await UserModal.findById(decoded.userId)
        .select("name refId email logo ")
        .lean();
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = verifyToken;
