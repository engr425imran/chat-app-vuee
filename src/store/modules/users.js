import { CometChat } from "@cometchat-pro/chat";
import axios from "axios";
const VUE_APP_API_URL = process.env.VUE_APP_BACKEND_URL;

const state = {
  irma: "khan",
  userFind: true,
};

const getters = {
  getIk: (state) => state.irma,
  getUserFind: (state) => state.userFind,
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

  addFriends({ commit }, payload) {
    const data = {
      email: payload,
    };
    axios
      .post(`${VUE_APP_API_URL}/chat/user/searchChatUser`, data)
      .then((res) => {
        console.log(res.data);
        commit("SET_USER_FIND", false);
      })
      .catch((error) => {
        console.log(error);
        commit("SET_IRMA", "ss");
      });
  },
};
const mutations = {
  SET_USER_FIND: (state, payload) => {
    state.userFind = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
