import { CometChat } from "@cometchat-pro/chat";
import sendMessage from "./sendMessage";
import reciveMessage from "./reciveMessage";
const state = {
  messages: [],
};
const getters = {
  getMessages: (state) => state.messages,
};
const actions = {
  async getOldMessagesBetweenUserr({ commit, dispatch }, roomId) {
    let UID = roomId;
    let limit = 5;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(UID)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      (messages) => {
        let payload = {
          messages,
          roomId,
        };
        dispatch("addOldMessagesToSateToMessagesArray", payload);
        console.log();
      },
      (error) => {
        console.log("Message fetching failed with error:", error);
        commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", false, {
          root: true,
        });
      }
    );
  },

  addOldMessagesToSateToMessagesArray(
    { commit, dispatch, rootGetters },
    payload
  ) {
    // addOldMessagesToSateToMessagesArray(messages, roomId) {
    var oldConverstion = [];
    payload.messages.forEach((element, index) => {
      var messageObject = {};
      messageObject["_id"] = element.id;
      messageObject["indexId"] = index + 1;
      messageObject["content"] = element.text;
      messageObject["senderId"] = element.rawMessage.sender;
      messageObject["username"] =
        element.rawMessage.sender == rootGetters["home/getCometUser"].uid
          ? rootGetters["home/getCometUser"].name
          : element.receiver.name;
      messageObject["timestamp"] = new Date(element.sentAt).toLocaleString(
        "en-us",
        { hour: "numeric", minute: "numeric" }
      );
      messageObject["date"] = new Date(element.sentAt)
        .toLocaleString("en-us", { day: "numeric", month: "short" })
        .split(" ")
        .reverse()
        .join(" ");
      messageObject["saved"] = true;
      messageObject["new"] = true;
      messageObject["converstionWith"] =
        element.receiverId == rootGetters["home/getCometUser"].uid
          ? element.sender.uid
          : element.receiverId;
      messageObject["distributed"] =
        element.deliveredAt &&
        element.sender.uid === rootGetters["home/getCometUser"].uid
          ? true
          : false;
      messageObject["seen"] =
        element.sentAt &&
        element.sender.uid === rootGetters["home/getCometUser"].uid
          ? true
          : false;
      messageObject["avatar"] = element.sender.avatar;
      oldConverstion.push(messageObject);
    });
    commit("conversation/SET_MESSAGE_LOADED", true, { root: true });
    commit("SET_MESSAGES", oldConverstion);
    console.log("messages added to  array Called From Message functio");
    dispatch("markAsReadd", payload.roomId);
    // this.markAsRead(roomId);
  },

  markAsReadd({ rootGetters, commit, getters }, textMessage) {
    // markAsReadd({ rootGetters }, textMessage) {
    let currentRoomsInState = rootGetters["conversation/getRooms"];
    currentRoomsInState.find;

    if (textMessage.rawMessage) {
      // var messageId = textMessage.rawMessage.id;
      // var receiverId = textMessage.sender.uid;
      // var receiverType = "user";
      // var senderId = textMessage.sender.uid;
      // CometChat.markAsRead(messageId, receiverId, receiverType, senderId).then(
      //   () => {
      //     const newArrayRooms = currentRoomsInState.map(function (room) {
      //       if (room.roomId === textMessage.sender.uid) {
      //         console.log(room.roomId);
      //         room.unreadCount = 0;
      //       }
      //       return room;
      //     });
      //     commit("SET_ROOMS", newArrayRooms, { root: true });
      //     console.log("message marked as read || the user was on chat window");
      //     return;
      //   },
      //   (error) => {
      //     console.log(
      //       "An error occurred when marking the message as read.",
      //       error
      //     );
      //     return;
      //   }
      // );
    }
    const room = currentRoomsInState.filter(function (room) {
      return room.roomId == textMessage;
    });
    if (room[0].unreadCount > 0) {
      let currentMessages = getters.getMessages;
      const message = currentMessages[currentMessages.length - 1];
      CometChat.markAsRead(
        message._id,
        message.converstionWith,
        "user",
        message.converstionWith
      ).then(
        () => {
          //     console.log("mark as read success.");
          const newArrayRooms = currentRoomsInState.map(function (room) {
            if (room.roomId == message.converstionWith) {
              room.unreadCount = 0;
            }
            return room;
          });
          commit("conversation/SET_ROOMS", newArrayRooms, { root: true });
          //     console.log(this.rooms);
          console.log(" marked as read || the user has just open chat window");
        },
        (error) => {
          console.log(
            "An error occurred when marking the message as read.",
            error
          );
        }
      );
      return;
    }
    console.log("no meessage to read");
  },
};
const mutations = {
  SET_MESSAGES: (state, payload) => {
    state.messages = payload;
  },
  PUSH_MESSAGE: (state, payload) => {
    state.messages.push(payload);
  },
};
const modules = {
  sendMessage,
  reciveMessage,
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules,
};
