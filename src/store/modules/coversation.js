import { CometChat } from "@cometchat-pro/chat";
import Swal from "sweetalert2";

const state = {
  rooms: [],
  errorMessage: "sss",
  conversationTabSelected: null,
  loadingRoomsInitial: false,
  unreadMessageIsPresent: false,
  roomId: null,
  messageLoaded: false,
};
// -------------------------------------- +++++++   **************  +++++++  ---------------------------------------------

const getters = {
  getRooms: (state) => state.rooms,
  getErrorMessage: (state) => state.errorMessage,
  getLoadingRoomsInitial: (state) => state.loadingRoomsInitial,
  getConversationTabSelected: (state) => state.conversationTabSelected,
  getUnreadMessageIsPresent: (state) => state.unreadMessageIsPresent,
  getRoomId: (state) => state.roomId,
  getMessagesLoaded: (state) => state.messageLoaded,
};

// -------------------------------------- +++++++   **************  +++++++  ---------------------------------------------

const actions = {
  getConverstionforUserr: ({ dispatch, commit }, payload) => {
    console.log(payload);
    commit("SET_CONVERSATION_TAB_SELECTED", true);
    commit("SET_INITIAL_STAGE_ROOMS_LOADING", true);
    commit("SET_MESSAGE_LOADED", false);
    let limit = 14;
    let conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(limit)
      .build();

    conversationsRequest.fetchNext().then(
      (conversationList) => {
        dispatch("displayConversation", conversationList);
        console.log(conversationList);
        if (conversationList.length == 0) dispatch("displayAlertBox");
      },
      (error) => {
        console.log("Conversations list fetching failed with error:", error);
        alert("some error occured while fetching conversation");
      }
    );
  },

  displayConversation: ({ commit, rootGetters }, conversationList) => {
    var newRooms = [];
    var roomObject;
    conversationList.forEach((element) => {
      if (element.conversationType === "group") {
        return;
      } else {
        roomObject = {};
        roomObject["roomId"] = element.conversationWith.uid;
        roomObject["roomName"] = element.conversationWith.name;
        roomObject["avatar"] = element.conversationWith.avatar;
        roomObject["uid"] = element.conversationWith.uid;
        roomObject["status"] = element.conversationWith.status;
        // ------------------------- dispatch set Unread message count ----------------------------
        // dispatch("setNewMessageCountInStatee", element.unreadMessageCount);
        // ---------------------------------------------------------------------------
        roomObject["unreadCount"] = element.unreadMessageCount;
        roomObject["users"] = [
          {
            _id: rootGetters["auth/getUser"].uid,
            username: rootGetters["auth/getUser"].first_name,
            avatar: rootGetters["auth/getUser"].avatar,
            status: {
              state: rootGetters["auth/getUser"].status,
              lastChanged: "live",
            },
          },
          {
            _id: element.conversationWith.uid,
            username: element.conversationWith.name,
            avatar: element.conversationWith.avatar,
            status: {
              state: element.conversationWith.status,
              lastChanged: new Date(
                element.conversationWith.lastActiveAt * 1000
              ).toLocaleString("en-us", {
                hour: "numeric",
                minute: "numeric",
                day: "2-digit",
              }),
            },
          },
        ];
        // roomObject["lastMessage"] = {
        roomObject["lastMessage"] = new Object();
        (roomObject["lastMessage"]["_id"] = element.lastMessage.id),
          (roomObject["lastMessage"]["content"] = element.lastMessage.text
            ? element.lastMessage.text
            : ""),
          (roomObject["lastMessage"]["senderId"] =
            element.lastMessage.sender.uid),
          (roomObject["lastMessage"]["username"] =
            element.lastMessage.sender.name),
          (roomObject["lastMessage"]["timestamp"] = new Date(
            element.lastMessage.deletedAt
              ? element.lastMessage.deletedAt
              : element.lastMessage.sentAt * 1000
          ).toLocaleString("en-us", {
            hour: "numeric",
            minute: "numeric",
          })),
          (roomObject["lastMessage"]["date"] = "today, 10:45");
        roomObject["lastMessage"]["saved"] = true;
        roomObject["lastMessage"]["deleted"] = element.lastMessage.deletedAt
          ? true
          : false;
        roomObject["lastMessage"]["distributed"] = element.lastMessage
          .deliveredAt
          ? true
          : false;
        roomObject["lastMessage"]["seen"] =
          element.lastMessage.readAt &&
          element.lastMessage.receiverId !== rootGetters["auth/getUser"].uid
            ? true
            : false;
        roomObject["lastMessage"]["new"] =
          element.lastMessage.receiverId == rootGetters["auth/getUser"].uid ||
          element.lastMessage.sender.uid == rootGetters["auth/getUser"].uid
            ? false
            : true;
        if (element.lastMessage.data.attachments) {
          let files = [];
          let filesObj = {
            // name: element.lastMessage.data.attachments[0].name,
            name: "element.lastMessage.data.attachments[0].name",
            audio: element.type === "audio" ? true : false,
            size: element.lastMessage.data.attachments[0].size,
            duration: element.lastMessage.metadata
              ? element.lastMessage.metadata.duration
              : false,
            type: element.lastMessage.data.attachments[0].mimeType,
            url: element.lastMessage.data.attachments[0].url,
          };
          files.push(filesObj);
          roomObject["lastMessage"]["files"] = files;
        }
        // files: [
        //   {
        //     name: element.lastMessage.attachments[0].name,
        //     type: element.lastMessage.attachments[0].mimeType,
        //     audio:
        //       element.lastMessage.attachments[0].extension === "mp3"
        //         ? true
        //         : false,
        //     url: element.lastMessage.attachments[0].url,
        //   },
        // ],
        // };
        // console.log(element);

        roomObject["typingUsers"] = [];
      }
      newRooms.push(roomObject);
    });
    console.log("rooms fetched from 2nd function");
    commit("SET_INITIAL_STAGE_ROOMS_LOADING", false);

    commit("SET_ROOMS", newRooms);
  },

  // --------------------------------------    **************   ---------------------------------------------
  //         ------------------------------   Genral Function   ------------------------------------------

  displayAlertBox: () => {
    Swal.fire({
      title: "You Have No Conversation Yet!",
      text: "Send Someone Message From Users Tab",
      icon: "warning",
      // showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK!",
    });
  },
};

// -------------------------------------- +++++++   **************  +++++++  ---------------------------------------------

const mutations = {
  SET_USER: (state, payload) => {
    state.errorMessage = payload;
  },
  SET_ROOMS: (state, payload) => {
    state.rooms = payload;
    state.messageLoaded = true;
    // state.roomId = payload[0].roomId;
  },
  SET_INITIAL_STAGE_ROOMS_LOADING: (state, payload) => {
    state.loadingRoomsInitial = payload;
  },
  SET_CONVERSATION_TAB_SELECTED: (state, payload) => {
    state.conversationTabSelected = payload;
  },
  SET_UNREAD_MESSAGE_PRESENT: (state, payload) => {
    state.unreadMessageIsPresent = payload;
  },
  SET_MESSAGE_LOADED: (state, payload) => {
    state.loadingRoomsInitial = false;
    state.messageLoaded = payload;
  },
};

const modules = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules,
};
