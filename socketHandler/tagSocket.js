const { addMessageInConversation } = require('../controllers/directChatController');
const { getMembersFortheTags } = require('../controllers/tagController');
const UserChatSocket = require("./UserChatSocket");
const tagSocket = (socket, io) => {
    try {
        const { userId } = socket.user;
        // socket.on("friend-list", async (data) => {
        //     await userChatList(data.userId, socket);
        // });
        socket.on("tag-broadcast-message", async (data) => {  // recieve a message from user
            const memberResponse = await getMembersFortheTags(userId, data.tag, data)
            if (memberResponse.status) {
                await Promise.all(memberResponse.data.map(async (member) => {
                    var response = await addMessageInConversation(userId, member, data)
                    UserChatSocket.emitDirectInboxToUser(response.participents.filter(x => x !== userId), response.data, io)  // send message to the sender and the reciever
                }))
            }

        });

    } catch (error) {
        console.log("Error occurred in socket", error.message);
    }
};

// function emitMessageToUser(Users, message, io) {
//     const connectionId = serverStore.getActiveConnections(Users.map(x => x.toString()));
//     connectionId.forEach(x => {
//         io.to(x).emit("receive-direct-message", message); // broadcast message to the selected users if they are active
//     })
// }

module.exports = {
    tagSocket,
};
