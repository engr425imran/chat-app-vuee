import router from "@/router";
import { CometChat } from "@cometchat-pro/chat";
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
    var authKey = "25226e843db138c8148e28a0881aaa56ab0bbbf6";
    CometChat.getLoggedinUser().then(
      (user) => {
        if (!user) {
          CometChat.login(UID, authKey).then(
            (user) => {
              localStorage.setItem("user", JSON.stringify(user));
              this.loading = false;
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
  logout: ({ commit }) => {
    CometChat.logout().then(
      () => {
        console.log("Logout completed successfully");
        localStorage.removeItem("user");
        commit("REMOVE_USER", null);
        router.push("/");
      },
      (error) => {
        console.log("Logout failed with exception:", { error });
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
  REMOVE_USER: (state, payload) => {
    state.usercomet = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
