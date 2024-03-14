const { v4: uuidv4 } = require("uuid");

const connectedUsers = new Map();

let io = null;

// creating a global io instance to use in multiple files. io is needed to emit events
const setSocketServerInstance = (ioInstance) => {
    io = ioInstance;
};

const getSocketServerInstance = () => {
    return io;
};


const addNewConnectedUser = ({ socketId, userId }) => {
    connectedUsers.set(socketId, { userId });
    console.log("new connected users");
    console.log(connectedUsers);
  };


  const removeConnectedUser = (socketId) => {
    if (connectedUsers.has(socketId)) {
      connectedUsers.delete(socketId);
      console.log("new connected users");
      console.log(connectedUsers);
    }
  };


  // fetch connection if for active users
  const getActiveConnections = (userIds) => {
    const activeConnections = []
    connectedUsers.forEach(function (value, key) {
      if (userIds.includes(value.userId)) {
        activeConnections.push(key); // key is socketId
      }
    });
    return activeConnections;
  };


  
module.exports = {
    addNewConnectedUser,
    setSocketServerInstance,
    getSocketServerInstance,
    removeConnectedUser,
    getActiveConnections
  };
  