import { CometChat } from "@cometchat-pro/chat";
const state = {
  audio: require("@/assets/audio/notifi.wav"),
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
        },
        onTypingEnded: (typingIndicator) => {
          const id = typingIndicator.sender.uid;
          dispatch("endTypingIndicatorForUser", id);
        },

        onTextMessageReceived: (textMessage) => {
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
            dispatch("messages/markAsReadd", textMessage, { root: true });
            return;
          }
          dispatch("updateRoomLastMessage", payload);
          // dispatch("messages/markAsReadd", payload, { root: true });
        },
      })
    );
  },

  playMessageSound({ getter }) {
    console.log("why i am not shoing");
    var audio = new Audio(getter.getAudio);
    audio.play();
    document.title = "1 New Message recived";
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
