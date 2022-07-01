import router from "@/router";
const VUE_APP_API_URL = process.env.VUE_APP_API_URL;
const authKey = process.env.VUE_APP_COMET_AUTH_KEY;
import axios from "axios";
import { CometChat } from "@cometchat-pro/chat";

const state = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  accessToken: localStorage.getItem("access_token") || null,
  loading: false,
  errorMessage: "",
};
const getters = {
  getUser: (state) => state.user,
  getToken: (state) => state.accessToken,
  getLoadingStatus: (state) => state.loading,
  getErrorMessage: (state) => state.errorMessage,
};
const actions = {
  loginUser: async ({ commit, dispatch }, payload) => {
    commit("SET_LOADING_STATUS", true);
    const body = {
      email: payload.email,
      password: payload.password,
    };
    await axios
      .post(`${VUE_APP_API_URL}/chat/user/login`, body)
      // .post("http://localhost:8000/api/user/login", body)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem(
          "access_token",
          JSON.stringify(res.data.access_token)
        );
        dispatch("loginUserToCometChat", res.data.user);
        // commit("SET_LOADING_STATUS", false);
      })
      .catch((error) => {
        if (error.response.data.message)
          commit("SET_ERROR_MESSAGE", error.response.data.message);
        commit("SET_LOADING_STATUS", false);
      });
  },

  loginUserToCometChat({ commit }, payload) {
    CometChat.getLoggedinUser().then(
      (user) => {
        if (!user) {
          CometChat.login(payload.uid, authKey).then(
            (user) => {
              const UpdateUser = { ...payload, ...user };
              localStorage.setItem("user", JSON.stringify(UpdateUser));
              commit("SET_USER", UpdateUser);
              commit("SET_LOADING_STATUS", false);
              router.push("/chatUIPage");
            },
            (error) => {
              commit("SET_LOADING_STATUS", false);
              console.log("Login failed with exception:", { error });
            }
          );
        }
      },
      (error) => {
        console.log("Something went wrong", error);
      }
    );
  },
  logoutUser: async ({ commit, state, dispatch }) => {
    await axios
      .get(`${VUE_APP_API_URL}/chat/user/logout`, {
        headers: { Authorization: `Bearer ${state.token}` },
      })
      .then(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        dispatch("logout");
        commit("REMOVE_USER");
      })
      .catch((e) => {
        console.log(e);
      });
  },
  logout: () => {
    CometChat.logout().then(
      () => {
        console.log("Logout completed successfully");
        router.push("/login");
      },
      (error) => {
        console.log("Logout failed with exception:", { error });
      }
    );
  },
};
const mutations = {
  SET_USER: (state, payload) => {
    state.user = payload;
    state.loading = false;
  },
  SET_LOADING_STATUS: (state, payload) => {
    state.loading = payload;
  },
  REMOVE_USER: (state, payload) => {
    state.user = payload;
  },
  REMOVE_CHAT_USER: (state, payload) => {
    state.chatUser = payload;
  },
  SET_ERROR_MESSAGE: (state, payload) => {
    state.errorMessage = payload;
  },
  SET_CHAT_USER: (state, payload) => {
    state.chatUser = payload;
  },
  SET_ACCESS_TOKEN: (state, payload) => {
    state.accessToken = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
