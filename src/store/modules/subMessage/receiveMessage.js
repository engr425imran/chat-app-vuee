import { CometChat } from "@cometchat-pro/chat";
const state = {
  audio: "some value",
  check: null,
};
const getters = {
  getAudio: (state) => state.audio,
};
const actions = {
  listningforMessagee: ({ commit, dispatch }, room) => {
    // listningforMessagee: () => {
    let listenerID = "UNIQUE_LISTENER_ID";
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTypingStarted: (typingIndicator) => {
          const id = typingIndicator.sender.uid;
          dispatch("startTypingIndicatorForUser", id);
          // console.log(typingIndicator);
        },
        onTypingEnded: (typingIndicator) => {
          const id = typingIndicator.sender.uid;
          dispatch("endTypingIndicatorForUser", id);
        },
        onTextMessageReceived: (textMessage) => {
          dispatch("checkIfUsersOrConversationTabIsSelected");
          // console.log(textMessage);
          // dispatch("playMessageSound", textMessage.sender.name);

          const message = {
            _id: textMessage.id,
            indexId: textMessage.id,
            senderId: textMessage.sender.uid,
            username: textMessage.sender.name,
            avatar: textMessage.sender.avatar,
            content: textMessage.data.text,
            date: new Date(textMessage.sentAt * 1000)
              .toLocaleString("en-us", {
                day: "numeric",
                month: "short",
              })
              .split(" ")
              .reverse()
              .join(" "),
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
            dispatch("playMessageSound", textMessage.sender.name);
            dispatch("updateRoomLastMessage", payload);
            dispatch("messages/markAsReadd", textMessage, { root: true });
            return;
          }
          dispatch("playMessageSound", textMessage.sender.name);
          dispatch("updateRoomLastMessage", payload);
        },
        onMediaMessageReceived: (mediaMessage) => {
          console.log("Media message received successfully", mediaMessage);
          let mediaMessageObject = new Object();
          mediaMessageObject["_id"] = mediaMessage.id;
          mediaMessageObject["indexId"] = mediaMessage.id;
          mediaMessageObject["senderId"] = mediaMessage.sender.uid;
          mediaMessageObject["username"] = mediaMessage.sender.name;
          mediaMessageObject["avatar"] = mediaMessage.sender.avatar;
          mediaMessageObject["content"] = mediaMessage.text
            ? mediaMessage.text
            : "";
          mediaMessageObject["date"] = new Date(mediaMessage.sentAt * 1000)
            .toLocaleString("en-us", {
              day: "numeric",
              month: "short",
            })
            .split(" ")
            .reverse()
            .join(" ");
          mediaMessageObject["timestamp"] = new Date(mediaMessage.sentAt * 1000)
            .toLocaleString("en-us", {
              hour: "numeric",
              minute: "numeric",
            })
            .split(" ")
            .reverse()
            .join(" ");
          mediaMessageObject["saved"] = true;
          mediaMessageObject["distributed"] = true;
          mediaMessageObject["new"] = true;
          let filesInMessage = [];
          mediaMessage.data.attachments.forEach((element) => {
            let filesObj = {
              name: element.name,
              audio: element.extension === "mp3" ? true : false,
              size: element.size,
              type: element.mimeType,
              url: element.url,
              extension: element.extension,
              duration: mediaMessage.metadata
                ? mediaMessage.metadata.duration
                : false,
            };
            filesInMessage.push(filesObj);
          });
          mediaMessageObject["files"] = filesInMessage;
          let payload = {
            textMessage: mediaMessageObject,
            message: mediaMessageObject,
            roomId: room.roomId,
          };
          if (room.roomId == mediaMessage.sender.uid) {
            commit("messages/PUSH_MESSAGE", mediaMessageObject, { root: true });
            dispatch("updateRoomLastMessage", payload);
            // dispatch("messages/markAsReadd", textMessage, { root: true });
            return;
          }
        },
      })
    );
  },

  checkIfUsersOrConversationTabIsSelected({ rootGetters, dispatch }) {
    const status = rootGetters["conversation/getConversationTabSelected"];
    // console.log(status, "sss");
    if (status === null) {
      console.log(status);
      dispatch("conversation/getConverstionforUserr", "dd", { root: true });
    }
  },

  playMessageSound({ commit }, payload) {
    console.log("sss");
    const audio = new Audio(require("@/assets/audio/notifi.wav"));
    const currntDocumentTitle = document.title;
    document.title = "New Message " + payload;
    audio.play();
    setTimeout(() => {
      document.title = currntDocumentTitle;
    }, 3000);
    commit("SET_CHECK", true);
  },
  updateRoomLastMessage: ({ commit, rootGetters }, payload) => {
    let currentRooms = rootGetters["conversation/getRooms"];
    currentRooms.forEach((element, index) => {
      // console.log("ss");
      if (
        element.roomId == payload.textMessage.sender.uid ||
        payload.mediaMessageObject.sender.uid
      ) {
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

  startTypingIndicatorForUser: ({ rootGetters, commit }, payload) => {
    let currentRooms = rootGetters["conversation/getRooms"];
    let updatedRoomsArray = currentRooms.map((element) => {
      if (element.roomId == payload) {
        element.typingUsers = [payload];
        return element;
      }
      return element;
    });
    commit("conversation/SET_ROOMS", updatedRoomsArray, { root: true });
  },
  endTypingIndicatorForUser: ({ rootGetters, commit }, payload) => {
    let currentRooms = rootGetters["conversation/getRooms"];
    let updatedRoomsArray = currentRooms.map((element) => {
      if (element.roomId == payload) {
        element.typingUsers = [];
        return element;
      }
      return element;
    });
    commit("conversation/SET_ROOMS", updatedRoomsArray, { root: true });
  },
};
const mutations = {
  SET_CHECK: (state, payload) => {
    state.check = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
