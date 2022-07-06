import { CometChat } from "@cometchat-pro/chat";

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
  getConverstionforUserr: ({ dispatch, commit }) => {
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
      },
      (error) => {
        console.log("Conversations list fetching failed with error:", error);
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
        roomObject["lastMessage"] = {
          _id: element.lastMessage.id,
          content: element.lastMessage.text ? element.lastMessage.text : "",
          senderId: element.lastMessage.sender.uid,
          username: element.lastMessage.sender.name,
          timestamp: new Date(
            element.lastMessage.deletedAt
              ? element.lastMessage.deletedAt
              : element.lastMessage.sentAt * 1000
          ).toLocaleString("en-us", {
            hour: "numeric",
            minute: "numeric",
          }),
          date: "today, 10:45",
          saved: true,
          deleted: element.lastMessage.deletedAt ? true : false,
          distributed: element.lastMessage.deliveredAt ? true : false,
          seen:
            element.lastMessage.readAt &&
            element.lastMessage.receiverId !== rootGetters["auth/getUser"].uid
              ? true
              : false,
          new:
            element.lastMessage.receiverId == rootGetters["auth/getUser"].uid ||
            element.lastMessage.sender.uid == rootGetters["auth/getUser"].uid
              ? false
              : true,
        };
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

  formatTime(utcTime) {
    const time = new Date(utcTime * 1000).toLocaleString("en-us", {
      hour: "numeric",
      minute: "numeric",
    });
    return time;
  },
  formatDate(utcTime) {
    const dd = new Date(utcTime * 1000).toLocaleString("en-us", {
      day: "numeric",
      month: "long",
    });
    const formatime = dd.split(" ").reverse().join(" ");
    return formatime;
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
