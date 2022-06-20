import { CometChat } from "@cometchat-pro/chat";
const state = {
  check: "wali",
};
const getters = {};

const actions = {
  delete: ({ dispatch }, payload) => {
    let messageId = payload.messageId;
    CometChat.deleteMessage(messageId).then(
      () => {
        let newPayload = {
          messageId,
          roomId: payload.roomId,
        };
        dispatch("filterMessageStateArray", newPayload);
      },
      (error) => {
        console.log("Message delete failed with error:", error);
      }
    );
  },
  filterMessageStateArray: ({ commit, rootGetters }, newPayload) => {
    let currentMessages = rootGetters["messages/getMessages"];
    const updateMessage = currentMessages.map(function (element) {
      if (element._id == newPayload.messageId) {
        element.deleted = true;
        return element;
      }
      return element;
    });
    console.log(updateMessage);
    commit("messages/SET_MESSAGES", updateMessage, { root: true });
    // dispatch("updateRoomLastMessage", newPayload.roomId);
  },
  //   updateRoomLastMessage: ({ commit, rootGetters }, payload) => {
  //     let currentRooms = rootGetters["conversation/getRooms"];
  //     const roomNewOrder = currentRooms.map((element, index) => {
  //       if (element.roomId == payload) {
  //         currentRooms[index].lastMessage.deleted = true;
  //       }
  //     });
  //     commit("conversation/SET_ROOMS", roomNewOrder, { root: true });
  //   },
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
