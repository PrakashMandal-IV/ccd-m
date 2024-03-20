
const { addMessageInConversation, getDirectChatInbox } = require('../controllers/directChatController');
const serverStore = require('../serverStore')
const chatSocket = (socket, io) => {
    try {
        const { userId } = socket.user;
        // socket.on("friend-list", async (data) => {
        //     await userChatList(data.userId, socket);
        // });
        socket.on("direct-message", async (data) => {  // recieve a message from user

            var response = await addMessageInConversation(userId, data.reciever, data,'',null)
            if(response){
                emitMessageToUser(response.participents, response.data, io)  // send message to the sender and the reciever
                await GetInboxList(response.participents,io)
            }
           
        });

        socket.on("direct-inbox", async () => {  // recieve a message from user
            await GetInboxList([userId],io)
        });

    } catch (error) {
        console.log("Error occurred in socket", error.message);
    }
};
async function GetInboxList(userId,io) {
   userId.forEach(async(userid)=>{
    var response = await getDirectChatInbox(userid)
    emitDirectInboxToUser([userid], response, io)
   })
}
function emitMessageToUser(Users, message, io) {
    const connectionId = serverStore.getActiveConnections(Users.map(x => x.toString()));
    connectionId.forEach(x => {
        io.to(x).emit("receive-direct-message", message); // broadcast message to the selected users if they are active
    })
}

function emitDirectInboxToUser(Users, inbox, io) {
    const connectionId = serverStore.getActiveConnections(Users.map(x => x.toString()));
    connectionId.forEach(x => {
        io.to(x).emit("receive-direct-inboxlist", inbox); // broadcast message to the selected users if they are active
    })
}
module.exports = {
    chatSocket,
};
