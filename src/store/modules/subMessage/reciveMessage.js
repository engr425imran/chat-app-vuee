import { CometChat } from "@cometchat-pro/chat";
const state = {};
const getters = {};
const actions = {
  listningforMessagee: ({ commit, dispatch }, room) => {
    let listenerID = "UNIQUE_LISTENER_ID";
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage) => {
          console.log("message recived", textMessage);
          // this.playMessageSound();
          const message = {
            _id: textMessage.rawMessage.id,
            indexId: textMessage.rawMessage.id,
            senderId: textMessage.sender.uid,
            username: textMessage.sender.name,
            avatar: textMessage.sender.avatar,
            content: textMessage.data.text,
            date: new Date(textMessage.sentAt * 1000).toLocaleString("en-us", {
              hour: "numeric",
              minute: "numeric",
            }),
            timestamp: new Date(textMessage.sentAt * 1000)
              .toLocaleString("en-us", {
                hour: "numeric",
                minute: "numeric",
              })
              .split(" ")
              .reverse()
              .join(" "),
            saved: true,
            distributed: true,
            new: true,
          };
          let payload = {
            textMessage,
            message,
            roomId: room.roomId,
          };
          if (room.roomId == textMessage.sender.uid) {
            commit("messages/PUSH_MESSAGE", message, { root: true });
            dispatch("updateRoomLastMessage", payload);
            return;
          }
          dispatch("updateRoomLastMessage", payload);
          // this.markAsRead(textMessage);
        },
      })
    );
  },
  updateRoomLastMessage: ({ commit, rootGetters }, payload) => {
    let currentRooms = rootGetters["conversation/getRooms"];
    currentRooms.forEach((element, index) => {
      if (element.roomId == payload.textMessage.sender.uid) {
        currentRooms[index].unreadCount = 1;
        currentRooms[index].lastMessage = payload.message;
        currentRooms[index].users[1].status.state =
          payload.textMessage.sender.status;
        if (payload.roomId == payload.textMessage.sender.uid && index == 0)
          return;
        const removeRoomMoveFirst = currentRooms.splice(index, 1);
        let newOrder = [removeRoomMoveFirst[0], ...currentRooms];
        commit("conversation/SET_ROOMS", newOrder, { root: true });
      }
    });
  },
};
const mutations = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
