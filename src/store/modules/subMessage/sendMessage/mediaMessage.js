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
  sendAudioToBackend: ({ commit, dispatch }, payload) => {
    console.log(payload);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    let data = new FormData();
    data.append("audio", payload.arrageFiles[0].source);
    axios
      .post(`${VUE_APP_API_URL}/chat/user/audio-files`, data, config)
      .then((res) => {
        payload.arrageFiles[0].url = res.data.filePath;
        dispatch("sendAudioMessage", payload);
      })
      .catch((e) => {
        console.log(e);
        commit("SET_CHECK", "sss");
      });
  },

  sendAudioMessage: ({ commit, rootGetters }, payload) => {
    console.log(payload.arrageFiles[0]);
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

    let attachment = new CometChat.Attachment(payload.arrageFiles[0]);
    let metadata = {
      duration: payload.arrageFiles[0].duration,
    };

    mediaMessage.setMetadata(metadata);

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
              audio: payload.arrageFiles[0].audio,
              duration: payload.arrageFiles[0].duration,
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

  sendImageToBackend({ commit, dispatch }, payload) {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    };
    const totalFilesAttached = payload.arrageFiles.length;
    payload.arrageFiles.forEach((element, index) => {
      let data = new FormData();
      data.append("messageFile", element.source);
      data.append("messageExtension", element.extension);
      axios
        .post(`${VUE_APP_API_URL}/chat/user/image-files`, data, config)
        .then((res) => {
          element.url = res.data.filePath;
          if (totalFilesAttached == 1) {
            dispatch("sendImageMessage", payload);
          } else if (totalFilesAttached == index + 1) {
            setTimeout(function () {
              dispatch("sendImageMessage", payload);
            }, 2000);
          }
        })
        .catch((e) => {
          console.log(e);
          commit("SET_CHECK", "sss");
          dispatch("sendImageMessage", payload);
        });
    });
  },

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
    let attachments = [];
    payload.arrageFiles.forEach((element) => {
      console.log(element.url);
      attachments.push(new CometChat.Attachment(element));
    });
    mediaMessage.setAttachments(attachments);

    CometChat.sendMediaMessage(mediaMessage).then(
      (mediaMessage) => {
        console.log("message ccc", mediaMessage);
        const messagePushToState = new Object();
        messagePushToState["_id"] = mediaMessage.id;
        messagePushToState["indexId"] = mediaMessage.id;
        messagePushToState["senderId"] = rootGetters["auth/getUser"].uid;
        messagePushToState["content"] = mediaMessage.text
          ? mediaMessage.text
          : "";
        messagePushToState["username"] = rootGetters["auth/getUser"].username;
        messagePushToState["avatar"] = rootGetters["auth/getUser"].avatar;
        messagePushToState["timestamp"] = new Date(
          mediaMessage.sentAt * 1000
        ).toLocaleString("en-us", {
          hour: "numeric",
          minute: "numeric",
        });
        messagePushToState["date"] = new Date(mediaMessage.sentAt * 1000)
          .toLocaleString("en-us", {
            day: "numeric",
            month: "short",
          })
          .split(" ")
          .reverse()
          .join(" ");
        messagePushToState["saved"] = true;
        messagePushToState["distributed"] =
          room.users[1].status.state === "online" ? true : false;
        messagePushToState["seen"] = false;
        let files = [];
        mediaMessage.data.attachments.forEach((element) => {
          let filesObj = {
            name: element.name,
            size: element.size,
            type: element.mimeType,
            url: element.url,
          };
          files.push(filesObj);
        });
        messagePushToState["files"] = files;
        commit("messages/PUSH_MESSAGE", messagePushToState, { root: true });
      },
      (error) => {
        console.log("error in sending message", error);
      }
    );
    commit("SET_CHECK", room);
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
