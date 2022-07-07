import router from "@/router";
const VUE_APP_API_URL = process.env.VUE_APP_BACKEND_URL;
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
  disableInput: false,
};
const getters = {
  getUser: (state) => state.user,
  getDisableInput: (state) => state.disableInput,
  getToken: (state) => state.accessToken,
  getLoadingStatus: (state) => state.loading,
  getErrorMessage: (state) => state.errorMessage,
};
const actions = {
  loginUser: async ({ commit, dispatch }, payload) => {
    if (!payload.email.length && !payload.password.length) {
      commit("SET_ERROR_MESSAGE", "field is required ");
      return;
    }
    commit("auth/SET_DISABLED_INPUT", true, { root: true });
    commit("SET_LOADING_STATUS", true);
    commit("SET_DISABLED_INPUT", true);
    const body = {
      email: payload.email,
      password: payload.password,
    };
    await axios
      .post(`${VUE_APP_API_URL}/chat/user/login`, body)
      .then((res) => {
        localStorage.setItem("access_token", res.data.access_token);
        commit("SET_DISABLED_INPUT", false);
        commit("SET_ACCESS_TOKEN", res.data.access_token);
        dispatch("loginUserToCometChat", res.data.user);
      })
      .catch((error) => {
        if (error.response) {
          commit("SET_ERROR_MESSAGE", error.response.data.message);
        } else if (error.request) {
          commit("SET_ERROR_MESSAGE", "server is unreachable sorry");
        } else {
          commit("SET_ERROR_MESSAGE", "error occured ");
        }
        commit("SET_DISABLED_INPUT", false);
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
              commit("SET_DISABLED_INPUT", false);
              router.push("/");
            },
            (error) => {
              commit("SET_LOADING_STATUS", false);
              console.log("Login failed with exception:", { error });
            }
          );
        }
      },
      (error) => {
        commit("SET_DISABLED_INPUT", false);
        console.log("Something went wrong", error);
      }
    );
  },
  logoutUser: async ({ commit, getters, dispatch }) => {
    await axios
      .get(`${VUE_APP_API_URL}/chat/user/logout`, {
        headers: { Authorization: `Bearer ${getters.getToken}` },
      })
      .then(() => {
        localStorage.removeItem("user");
        dispatch("logout", "check");
      })
      .catch((e) => {
        console.log(e);
        commit("CHECK", "sds");
      });
  },
  logout: ({ commit }, payload) => {
    CometChat.logout().then(
      () => {
        console.log("Logout completed successfully");
        commit("REMOVE_USER", null);
        localStorage.removeItem("access_token");
        console.log(payload);
        router.push("/login");
      },
      (error) => {
        console.log(commit);
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
  SET_DISABLED_INPUT: (state, payload) => {
    state.disableInput = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
