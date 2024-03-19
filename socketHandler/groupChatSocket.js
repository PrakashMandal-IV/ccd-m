const {
    getMembersRefIdofGroup,
    sendGroupMessage,
    getGroupChatInbox,
} = require("../controllers/groupChatController");
const serverStore = require("../serverStore");

const groupSocket = (socket, io) => {
    try {
        const { userId } = socket.user;

        socket.on("group-message", async (data) => {
            // recieve a message from user
            const response = await sendGroupMessage(userId, data);
            emitMessageToUser(response.participents, response.data, io);
            await getGroupInbox(response.participents, io)
        });

        socket.on("group-inbox", async () => {
            // recieve a message from user
            await getGroupInbox([userId], io)
        });
    } catch (error) {
        console.log("Error occurred in socket", error.message);
    }
};
async function getGroupInbox(userId, io) {
    userId.forEach(async (userid) => {
        var response = await getGroupChatInbox(userid);
        emitGroupInboxToUser([userid], response, io);
    })

}
function emitMessageToUser(Users, message, io) {
    const connectionId = serverStore.getActiveConnections(
        Users.map((x) => x.toString())
    );
    connectionId.forEach((x) => {
        io.to(x).emit("receive-group-message", message); // broadcast message to the selected users if they are active
    });
}

function emitGroupInboxToUser(Users, inbox, io) {
    const connectionId = serverStore.getActiveConnections(
        Users.map((x) => x.toString())
    );
    connectionId.forEach((x) => {
        io.to(x).emit("receive-group-inboxlist", inbox); // broadcast message to the selected users if they are active
    });
}

module.exports = {
    groupSocket,
};