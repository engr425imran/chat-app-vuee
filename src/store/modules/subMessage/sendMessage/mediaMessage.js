import { CometChat } from "@cometchat-pro/chat";
import axios from "axios";
const VUE_APP_API_URL = process.env.VUE_APP_BACKEND_URL;

const state = {
  check: "ddd",
};

const getters = {
  getCheck: (state) => state.check,
};
const actions = {
  sendImageToBackend: ({ commit, dispatch }, payload) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    let data = new FormData();
    data.append("messageFile", payload.file.source);
    axios
      .post(`${VUE_APP_API_URL}/chat/user/image-files`, data, config)
      .then((res) => {
        payload.file.url = res.data.filePath;
        dispatch("sendImageMessage", payload);
      })
      .catch((e) => {
        console.log(e);
        commit("SET_CHECK", "sss");
      });
  },
  sendAudioToBackend: ({ commit, dispatch }, payload) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    let data = new FormData();
    data.append("audio", payload.file.source);
    axios
      .post(`${VUE_APP_API_URL}/chat/user/audio-files`, data, config)
      .then((res) => {
        payload.file.url = res.data.filePath;
        dispatch("sendAudioMessage", payload);
      })
      .catch((e) => {
        console.log(e);
        commit("SET_CHECK", "sss");
      });
  },

  sendAudioMessage: ({ commit, rootGetters }, payload) => {
    var rooms = rootGetters["conversation/getRooms"];
    const room = rooms.find((ele) => ele.roomId == payload.receiverID);
    let messageType = CometChat.MESSAGE_TYPE.AUDIO;
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let mediaMessage = new CometChat.MediaMessage(
      payload.receiverID,
      "",
      messageType,
      receiverType
    );

    let attachment = new CometChat.Attachment(payload.file);

    mediaMessage.setAttachment(attachment);

    CometChat.sendMediaMessage(mediaMessage).then(
      (mediaMessage) => {
        console.log("Message sent successfully:", mediaMessage);
        const messagePushToState = {
          _id: mediaMessage.id,
          indexId: mediaMessage.id,
          senderId: rootGetters["auth/getUser"].uid,
          content: "",
          username: rootGetters["auth/getUser"].username,
          avatar: rootGetters["auth/getUser"].avatar,
          timestamp: new Date(mediaMessage.sentAt * 1000).toLocaleString(
            "en-us",
            {
              hour: "numeric",
              minute: "numeric",
            }
          ),
          date: new Date(mediaMessage.sentAt * 1000)
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
          files: [
            {
              name: mediaMessage.data.attachments[0].name,
              size: mediaMessage.data.attachments[0].size,
              type: mediaMessage.data.attachments[0].mimeType,
              audio: true,
              duration: payload.file.duration,
              url: mediaMessage.data.attachments[0].url,
              preview: mediaMessage.data.attachments[0].url,
            },
          ],
        };
        commit("messages/PUSH_MESSAGE", messagePushToState, { root: true });
      },
      (error) => {
        commit("SET_CHECK", "SS");
        console.log("error in sending message", error);
      }
    );
  },

  // sendImageMessage: ({ commit }, payload) => {
  sendImageMessage: ({ commit, rootGetters }, payload) => {
    var rooms = rootGetters["conversation/getRooms"];
    const room = rooms.find((ele) => ele.roomId == payload.receiverID);
    let messageType = CometChat.MESSAGE_TYPE.IMAGE;
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let mediaMessage = new CometChat.MediaMessage(
      payload.receiverID,
      "",
      messageType,
      receiverType
    );
    // url: "https://pngimg.com/uploads/mario/mario_PNG125.png",
    let attachment = new CometChat.Attachment(payload.file);
    mediaMessage.setAttachment(attachment);
    CometChat.sendMediaMessage(mediaMessage).then(
      (mediaMessage) => {
        console.log("message", mediaMessage);
        console.log("Message sent successfully:");
        const messagePushToState = {
          _id: mediaMessage.id,
          indexId: mediaMessage.id,
          senderId: rootGetters["auth/getUser"].uid,
          content: mediaMessage.text ? mediaMessage.text : "",
          username: rootGetters["auth/getUser"].username,
          avatar: rootGetters["auth/getUser"].avatar,
          timestamp: new Date(mediaMessage.sentAt * 1000).toLocaleString(
            "en-us",
            {
              hour: "numeric",
              minute: "numeric",
            }
          ),
          date: new Date(mediaMessage.sentAt * 1000)
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
          files: [
            {
              name: mediaMessage.data.attachments[0].name,
              size: mediaMessage.data.attachments[0].size,
              type: mediaMessage.data.attachments[0].mimeType,
              url: mediaMessage.data.attachments[0].url,
              preview: mediaMessage.data.attachments[0].url,
            },
          ],
        };
        commit("messages/PUSH_MESSAGE", messagePushToState, { root: true });
      },
      (error) => {
        commit("SET_CHECK", "SS");
        console.log("error in sending message", error);
      }
    );
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
