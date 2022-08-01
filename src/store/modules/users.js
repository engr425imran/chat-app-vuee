import { CometChat } from "@cometchat-pro/chat";
import axios from "axios";
const VUE_APP_API_URL = process.env.VUE_APP_BACKEND_URL;

const state = {
  irma: "khan",
  hideAddUserButton: false,
  userFind: true,
  dummy: localStorage.getItem("dummy")
    ? JSON.parse(localStorage.getItem("dummy"))
    : null,
};

const getters = {
  getIk: (state) => state.irma,
  getUserFind: (state) => state.userFind,
  getHideAddUserButton: (state) => state.hideAddUserButton,
  getDummy: (state) => state.dummy,
};

const actions = {
  displayUserss: ({ commit, rootGetters }) => {
    commit("conversation/SET_CONVERSATION_TAB_SELECTED", false, { root: true });
    commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", true, {
      root: true,
    });
    const users = new CometChat.UsersRequestBuilder().setLimit(15);
    // .friendsOnly(true);
    const usersRequest = users.build();
    usersRequest
      .fetchNext()
      .then((usersList) => {
        var newRooms = [];
        var roomObject;
        // console.log(usersList);
        usersList.forEach((element) => {
          roomObject = {};
          roomObject["roomId"] = element.uid;
          roomObject["roomName"] = element.name;
          roomObject["avatar"] = element.avatar;
          roomObject["uid"] = element.uid;
          roomObject["users"] = [
            {
              _id: rootGetters["auth/getUser"].uid,
              username: rootGetters["auth/getUser"].name,
              avatar: rootGetters["auth/getUser"].avatar,
              status: {
                state: rootGetters["auth/getUser"].status,
                lastChanged: "live",
              },
            },

            {
              _id: element.uid,
              username: element.name,
              avatar: element.avatar,
              status: {
                state: element.status,
                lastChanged: new Date(
                  element.lastActiveAt * 1000
                ).toLocaleString("en-us", {
                  hour: "numeric",
                  minute: "numeric",
                  day: "2-digit",
                }),
              },
            },
          ];
          newRooms.push(roomObject);
        });
        commit("conversation/SET_ROOMS", newRooms, { root: true });
        commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", false, {
          root: true,
        });
      })
      .catch((e) => {
        console.log(e);
        commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", false, {
          root: true,
        });
      });
  },

  async updateUserProfile({ commit, rootGetters }, payload) {
    const config = {
      headers: {
        Authorization: `Bearer ${rootGetters["auth/getToken"]}`,
      },
    };
    commit("auth/SET_LOADING_STATUS", true, { root: true });
    commit("auth/SET_DISABLED_INPUT", true, { root: true });

    await axios
      .post(`${VUE_APP_API_URL}/chat/user/update-avatar`, payload, config)
      .then((res) => {
        let user = rootGetters["auth/getUser"];
        user.avatar = res.data.newPath;
        console.log(res.data.newPath, user);
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));
        commit("auth/SET_USER", user, { root: true });
        commit("auth/SET_LOADING_STATUS", false, { root: true });
        commit("auth/SET_DISABLED_INPUT", false, { root: true });

        // dispatch("logout", "check");
      })
      .catch((e) => {
        console.log(e);
        commit("auth/SET_LOADING_STATUS", false, { root: true });
        commit("auth/SET_DISABLED_INPUT", false, { root: true });

        // commit("CHECK", "sds");
      });
  },

  searchUserInCometChat({ commit }, payload) {
    const data = {
      email: payload,
    };
    axios
      .post(`${VUE_APP_API_URL}/chat/user/searchChatUser`, data)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("dummy", JSON.stringify(res.data.user));

        commit("SET_USER_FIND", res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  addRoomForUser({ getters, rootGetters, commit, dispatch }) {
    dispatch("addFriendInCometChat", getters.getDummy.uid);
    commit("conversation/SET_CONVERSATION_TAB_SELECTED", false, { root: true });
    commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", true, {
      root: true,
    });
    // // .friendsOnly(true);
    var roomObject;
    // // console.log(usersList);
    let newRooms = [];
    roomObject = {};
    roomObject["roomId"] = getters.getDummy.uid;
    roomObject["roomName"] = getters.getDummy.first_name;
    roomObject["avatar"] = getters.getDummy.avatar;
    roomObject["uid"] = getters.getDummy.uid;
    let users = [
      {
        _id: rootGetters["auth/getUser"].uid,
        username: rootGetters["auth/getUser"].name,
        avatar: rootGetters["auth/getUser"].avatar,
        status: {
          state: rootGetters["auth/getUser"].status,
          lastChanged: "live",
        },
      },

      {
        _id: getters.getDummy.uid,
        username: getters.getDummy.last_name,
        avatar: getters.getDummy.avatar,
        status: {
          state: "offline",
          lastChanged: new Date().toLocaleString("en-us", {
            hour: "numeric",
            minute: "numeric",
            day: "2-digit",
          }),
        },
      },
    ];
    roomObject["users"] = users;
    console.log(roomObject);
    newRooms.push(roomObject);
    console.log(newRooms);
    commit("conversation/SET_ROOMS", newRooms, { root: true });
    commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", false, {
      root: true,
    });
    commit("SET_HIDE_ADD_USER_BUTTON", false);
  },

  addFriendInCometChat({ commit, rootGetters }, payload) {
    let usersIds = [payload];

    let data = {
      userUID: rootGetters["auth/getUser"].uid,
      userIDs: usersIds,
      // userIDs: usersIds.push(payload),
    };
    axios
      .post(`${VUE_APP_API_URL}/chat/user/addFriends`, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
        commit("SET");
      });
  },
};

const mutations = {
  SET_USER_FIND: (state, payload) => {
    state.dummy = payload;
    state.userFind = false;
  },
  SET_HIDE_ADD_USER_BUTTON: (state, payload) => {
    state.hideAddUserButton = payload;
  },
  SET: () => {
    console.log("rrr");
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
