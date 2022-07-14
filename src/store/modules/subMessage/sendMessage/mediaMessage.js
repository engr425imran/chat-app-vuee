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
        console.log("Message sent successfully:");
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
          files: [payload.file],
          // files: [
          //   {
          //     name: 'My File',
          //     size: 67351,
          //     type: 'png',
          //     audio: true,
          //     duration: 14.4,
          //     url: 'https://firebasestorage.googleapis.com/...',
          //     preview: 'data:image/png;base64,iVBORw0KGgoAA...',
          //     progress: 88
          //   }
          // ],
        };
        commit("messages/PUSH_MESSAGE", messagePushToState, { root: true });
      },
      (error) => {
        commit("SET_CHECK", "SS");
        console.log("error in sending message", error);
      }
    );
  },

  sendImageToBackend: ({ commit, dispatch }, payload) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    let data = new FormData();
    data.append("avatar", payload.file.source);
    axios
      .post("http://localhost:8000/api/chat/user/files", data, config)
      .then((res) => {
        console.log(res.data);
        payload.file.url = res.data.filePath;
        dispatch("sendImageMessage", payload);
      })
      .catch((e) => {
        console.log(e);
        commit("SET_CHECK", "sss");
      });
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
          // files: [payload.file],
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
  dispalyImage: ({ rootGetters, commit }, payload) => {
    var rooms = rootGetters["conversation/getRooms"];
    const room = rooms.find((ele) => ele.roomId == payload.receiverID);

    const messagePushToState = {
      _id: Math.floor(Math.random() * 1000),
      indexId: Math.floor(Math.random() * 1000),
      senderId: rootGetters["auth/getUser"].uid,
      content: "sasas",
      username: rootGetters["auth/getUser"].username,
      avatar: rootGetters["auth/getUser"].avatar,
      timestamp: new Date().toLocaleString("en-us", {
        hour: "numeric",
        minute: "numeric",
      }),
      date: new Date()
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
      files: [payload.file],
      // files: [
      //   {
      //     name: 'My File',
      //     size: 67351,
      //     type: 'png',
      //     audio: true,
      //     duration: 14.4,
      //     url: 'https://firebasestorage.googleapis.com/...',
      //     preview: 'data:image/png;base64,iVBORw0KGgoAA...',
      //     progress: 88
      //   }
      // ],
    };
    commit("messages/PUSH_MESSAGE", messagePushToState, { root: true });
  },
  check: ({ commit, rootGetters }, payload) => {
    axios
      .post(`${VUE_APP_API_URL}/chat/user/files`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    const message = {
      _id: 7890,
      indexId: 12092,
      content: "",
      senderId: rootGetters["auth/getUser"].uid,
      username: rootGetters["auth/getUser"].name,
      avatar: rootGetters["auth/getUser"].avatar,
      date: "13 November",
      timestamp: "10:20",
      system: false,
      saved: true,
      distributed: true,
      seen: true,
      deleted: false,
      failure: false,
      disableActions: false,
      disableReactions: false,
      files: [
        {
          name: "My File",
          size: payload.file.size,
          type: "jpeg",
          // url: payload.file.url,
          // preview: payload.file.url,
          // progress: 100,
        },
      ],
    };

    commit("messages/PUSH_MESSAGE", message, { root: true });
    console.log(payload);
  },
  saveFile({ commit, rootGetters }, payload) {
    const config = {
      headers: { Authorization: `Bearer ${rootGetters["auth/getToken"]}` },
    };
    console.log(payload);
    // const data = {
    //   avatar: payload.file.url,
    // };
    let data = new FormData();
    data.append("avatar", "fileB");
    axios
      .post(`${VUE_APP_API_URL}/chat/user/files`, data, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        commit("SET_CHECK", "sss");
        console.log(e);
      });
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
