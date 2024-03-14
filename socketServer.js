const serverStore = require("./serverStore");
const authSocket = require("./middleware/authSocket");



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
        newConnectionHandler(socket, io);
        socket.on("disconnect", () => {
            serverStore.removeConnectedUser(socket.id);
        });
    });
};


module.exports = {
    registerSocketServer,
};
