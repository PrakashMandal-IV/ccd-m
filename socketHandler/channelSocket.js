
const { getMembersRefIdofChannel } = require('../controllers/channelController');
const { addMessageInConversation } = require('../controllers/directChatController');
const serverStore = require('../serverStore')
const channelSocket = (socket, io) => {
    try {
        const { userId } = socket.user;
        // socket.on("friend-list", async (data) => {
        //     await userChatList(data.userId, socket);
        // });
        socket.on("channel-broadcast-message", async (data) => {  // recieve a message from user
            const memberResponse = await getMembersRefIdofChannel(userId, data.channelId)
            if (memberResponse.status) {
                await Promise.all(memberResponse.data.map(async (member) => {
                    var response = await addMessageInConversation(userId, member, data)
                     emitMessageToUser(response.participents.filter(x=>x!==userId), response.data, io)  // send message to the sender and the reciever
                }))
            }

        });

        socket.on("direct-inbox", async () => {  // recieve a message from user
            var response = await getDirectChatInbox(userId)
        });

    } catch (error) {
        console.log("Error occurred in socket", error.message);
    }
};

function emitMessageToUser(Users, message, io) {
    const connectionId = serverStore.getActiveConnections(Users.map(x => x.toString()));
    connectionId.forEach(x => {
        io.to(x).emit("receive-direct-message", message); // broadcast message to the selected users if they are active
    })
}

module.exports = {
    channelSocket,
};
