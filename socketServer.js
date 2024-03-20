const serverStore = require("./serverStore");
const authSocket = require("./middleware/authSocket");

const UserChatSocket = require("./socketHandler/UserChatSocket");
const ChannelSocket = require("./socketHandler/channelSocket");
const GroupSocket = require("./socketHandler/groupChatSocket");
const TagSocket = require("./socketHandler/tagSocket");

let io;

const registerSocketServer = (server) => {
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    serverStore.setSocketServerInstance(io);

    io.use((socket, next) => {
        authSocket(socket, next);
    });

    // const emitOnlineUsers = () => {
    //   const onlineUsers = serverStore.getOnlineUsers();
    //   io.emit("online-users", { onlineUsers });
    // };

    io.on("connection", (socket) => {
        const userDetail = socket.user;
        serverStore.addNewConnectedUser({
            socketId: socket.id,
            userId: userDetail.userId,
        });
        // init chat socket
        UserChatSocket.chatSocket(socket,io)

        //init channel socket
        ChannelSocket.channelSocket(socket,io)

        //init group socket
        GroupSocket.groupSocket(socket,io)
        
         //init tag socket
        TagSocket.tagSocket(socket,io)
        socket.on("disconnect", () => {
            serverStore.removeConnectedUser(socket.id);
        });
    });
};


module.exports = {
    registerSocketServer,
};
