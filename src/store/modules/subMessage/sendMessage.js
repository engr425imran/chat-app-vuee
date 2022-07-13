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
    const room = rooms.find((ele) => ele.roomId == payload.roomId);
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
        // this.messages.push(messagePushToState);
        commit("messages/PUSH_MESSAGE", messagePushToState, { root: true });
      },
      (error) => {
        console.log("Message sending failed with error:", error);
      }
    );
  },

  sendMediaMessage: ({ commit }, payload) => {
    let receiverID = payload.uid;
    let messageType = CometChat.MESSAGE_TYPE.AUDIO;
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let mediaMessage = new CometChat.MediaMessage(
      receiverID,
      payload.files,
      messageType,
      receiverType
    );

    CometChat.sendMediaMessage(mediaMessage).then(
      (message) => {
        console.log("Media message sent successfully", message);
      },
      (error) => {
        commit("SET_CHECK", "bilkul");
        console.log("Media message sending failed with error", error);
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
