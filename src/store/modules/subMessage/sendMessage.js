import { CometChat } from "@cometchat-pro/chat";
import mediaMessage from "./sendMessage/mediaMessage.js";
const state = {
  sent: "intial",
};
const getters = {
  getSent: (state) => state.sent,
};
const actions = {
  sendTextMessage: async ({ commit, rootGetters, dispatch }, payload) => {
    var rooms = rootGetters["conversation/getRooms"];
    let room = rooms.find((ele) => ele.roomId == payload.roomId);
    let receiverID = payload.roomId;
    let messageText = payload.content;
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType
    );
    CometChat.sendMessage(textMessage).then(
      (message) => {
        dispatch("endTypingUserActivity", payload.roomId);
        console.log("Message sent successfully:");
        const messagePushToState = {
          _id: message.id,
          indexId: message.id,
          senderId: rootGetters["auth/getUser"].uid,
          content: payload.content,
          username: rootGetters["auth/getUser"].username,
          avatar: rootGetters["auth/getUser"].avatar,
          timestamp: new Date(message.sentAt * 1000).toLocaleString("en-us", {
            hour: "numeric",
            minute: "numeric",
          }),
          date: new Date(message.sentAt * 1000)
            .toLocaleString("en-us", {
              day: "numeric",
              month: "short",
            })
            .split(" ")
            .reverse()
            .join(" "),
          saved: true,
          distributed: room.users[1].status.state === "online" ? true : false,
          seen: false,
        };
        room.lastMessage = messagePushToState;
        const removeOutdatedRoom = rooms.filter(
          (roomObjec) => roomObjec.uid !== room.uid
        );
        const newUpdatedRoomArray = [room, ...removeOutdatedRoom];
        commit("messages/PUSH_MESSAGE", messagePushToState, { root: true });
        commit("conversation/SET_ROOMS", newUpdatedRoomArray, { root: true });
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
  },

  endTypingUserActivity: ({ commit }, payload) => {
    // let receiverId = "UID";
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let typingNotification = new CometChat.TypingIndicator(
      payload,
      receiverType
    );
    CometChat.endTyping(typingNotification);
    commit("SET_CHECK", "gap");
  },
};
const mutations = {
  SET_CHECK: (state, payload) => {
    state.sent = payload;
  },
};

const modules = {
  mediaMessage,
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules,
};
