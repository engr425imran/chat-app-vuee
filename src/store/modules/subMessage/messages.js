import { CometChat } from "@cometchat-pro/chat";
import sendMessage from "./sendMessage";
import receiveMessage from "./receiveMessage";
import deleteMessage from "./deleteMessage";
const state = {
  messages: [],
};
const getters = {
  getMessages: (state) => state.messages,
};
const actions = {
  async getOldMessagesBetweenUserr({ commit, dispatch }, roomId) {
    commit("conversation/SET_MESSAGE_LOADED", false, { root: true });

    // async getOldMessagesBetweenUserr({ commit }, roomId) {
    let UID = roomId;
    let limit = 15;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(UID)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      (messages) => {
        // console.log(messages);
        let payload = {
          messages,
          roomId,
        };
        // console.log(payload);
        dispatch("addOldMessagesToSateToMessagesArray", payload);
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
    let messageCount = payload.messages.length;
    if (messageCount == 0) {
      commit("conversation/SET_MESSAGE_LOADED", true, { root: true });
      commit("SET_MESSAGES", []);
      commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", false, {
        root: true,
      });
      return;
    }
    var oldConverstion = [];
    payload.messages.forEach((element, index) => {
      if (element.action === "deleted") return;
      var messageObject = {};
      messageObject["_id"] = element.id;
      messageObject["indexId"] = index + 1;
      messageObject["content"] = element.text ? element.text : "";
      messageObject["senderId"] = element.rawMessage.sender;
      messageObject["username"] =
        element.rawMessage.sender == rootGetters["auth/getUser"].uid
          ? rootGetters["auth/getUser"].name
          : element.receiver.name;
      messageObject["timestamp"] = new Date(
        element.sentAt * 1000
      ).toLocaleString("en-us", { hour: "numeric", minute: "numeric" });
      messageObject["date"] = new Date(element.sentAt * 1000)
        .toLocaleString("en-us", {
          day: "2-digit",
          month: "short",
        })
        .split(" ")
        .reverse()
        .join(" ");
      messageObject["saved"] = true;
      messageObject["deleted"] = element.deletedAt ? true : false;
      messageObject["new"] = true;
      messageObject["converstionWith"] =
        element.receiverId == rootGetters["auth/getUser"].uid
          ? element.sender.uid
          : element.receiverId;
      messageObject["distributed"] =
        element.deliveredAt &&
        element.sender.uid === rootGetters["auth/getUser"].uid
          ? true
          : false;
      messageObject["seen"] =
        element.sentAt && element.sender.uid === rootGetters["auth/getUser"].uid
          ? true
          : false;
      messageObject["avatar"] = element.sender.avatar;
      if (
        (element.type === "image" && !element.deletedAt) ||
        (element.type === "audio" && !element.deletedAt)
      ) {
        let files = [];
        element.data.attachments.forEach((childElement) => {
          let filesObj = {
            name: childElement.name,
            audio: childElement.extension === "mp3" ? true : false,
            size: childElement.size,
            type: childElement.mimeType,
            url: childElement.url,
          };
          files.push(filesObj);
        });
        messageObject["files"] = files;
      }
      oldConverstion.push(messageObject);
    });
    commit("SET_MESSAGES", oldConverstion);
    console.log("messages added to  array Called From Message function");
    dispatch("markAsReadd", payload.roomId);
    commit("conversation/SET_MESSAGE_LOADED", true, { root: true });
  },

  markAsReadd({ rootGetters, commit, getters }, textMessage) {
    let currentRoomsInState = rootGetters["conversation/getRooms"];
    if (textMessage.rawMessage) {
      var messageId = textMessage.rawMessage.id;
      var receiverId = textMessage.sender.uid;
      var receiverType = "user";
      var senderId = textMessage.sender.uid;
      CometChat.markAsRead(messageId, receiverId, receiverType, senderId).then(
        () => {
          const newArrayRooms = currentRoomsInState.map(function (room) {
            if (room.roomId === textMessage.sender.uid) {
              room.unreadCount = 0;
            }
            return room;
          });
          commit("conversation/SET_ROOMS", newArrayRooms, { root: true });
          console.log("message marked as read || the user was on chat window");
          return;
        },
        (error) => {
          console.log(
            "An error occurred when marking the message as read.",
            error
          );
          return;
        }
      );
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
          console.log(" marked as read || the user has just open chat window");
        },
        (error) => {
          console.log(
            "An error occurred when marking the message as read.",
            error
          );
          return;
        }
      );
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
  receiveMessage,
  deleteMessage,
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules,
};
