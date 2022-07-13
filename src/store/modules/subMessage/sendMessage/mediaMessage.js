import { CometChat } from "@cometchat-pro/chat";
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
