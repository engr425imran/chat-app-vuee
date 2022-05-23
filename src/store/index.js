import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    checkUser: ({ commit }) => {
      const user = localStorage.getItem("user");
      if (user) {
        commit("SET_USER", user);
      }
    },
    loginUser: ({ commit }) => {
      localStorage.setItem("user", "imran khan");
      commit("SET_USER", "imran khan");
    },
    logoutUser: ({ commit }) => {
      localStorage.removeItem("user");
      commit("LOGOUT_USER");
    },
  },
  mutations: {
    SET_USER: (state, payload) => {
      state.user = payload;
    },
    LOGOUT_USER: (state) => {
      state.user = null;
    },
  },
  modules: {},
});
