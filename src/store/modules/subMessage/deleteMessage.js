import { CometChat } from "@cometchat-pro/chat";
import axios from "axios";
const VUE_APP_API_URL = process.env.VUE_APP_BACKEND_URL;

const state = {
  check: "wali",
};
const getters = {};

const actions = {
  delete: ({ dispatch }, payload) => {
    if (payload.message.files) {
      let data = {};
      data.fileUrl = payload.message.files[0].url;
      if (payload.message.files[0].audio) {
        data.audio = true;
      }
      axios
        .post(`${VUE_APP_API_URL}/chat/user/delete-files`, data)
        .then((res) => {
          console.log(res.data);
          dispatch("deleteMessageFromCometChat", payload);
          return;
        })
        .catch((e) => {
          console.log(e);
          dispatch("chhh");
          return;
        });
    } else {
      dispatch("deleteMessageFromCometChat", payload);
    }
  },
  deleteMessageFromCometChat: ({ dispatch }, payload) => {
    const messageId = payload.messageId;
    console.log(messageId);
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
  chhh: () => {
    console.log("sss");
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
