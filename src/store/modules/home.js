import router from "@/router";
import { CometChat } from "@cometchat-pro/chat";
const authKey = process.env.VUE_APP_COMET_AUTH_KEY;
const state = {
  usercomet: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  loading: false,
};
const getters = {
  getCometUser: (state) => state.usercomet,
  getLoading: (state) => state.loading,
};
const actions = {
  loginUsingCometChat({ commit }, payload) {
    commit("SET_LOADING_STATUS", true);
    var UID = payload;
    CometChat.getLoggedinUser().then(
      (user) => {
        if (!user) {
          CometChat.login(UID, authKey).then(
            (user) => {
              localStorage.setItem("user", JSON.stringify(user));
              commit("SET_USERCOMET", user);
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
};
const mutations = {
  SET_USERCOMET: (state, payload) => {
    state.usercomet = payload;
    state.loading = false;
  },
  SET_LOADING_STATUS: (state, payload) => {
    state.loading = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
