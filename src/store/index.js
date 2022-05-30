import auth from "./modules/auth";
import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    user: localStorage.getItem("user") || null,
  },
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    loginUser: async ({ commit }, payload) => {
      commit("SET_LOADING_STATUS", true);
      const body = {
        email: payload.email,
        password: payload.password,
      };
      localStorage.setItem("user", JSON.stringify(body));
      commit("SET_USER", body);
    },
    logoutUser: async ({ commit }) => {
      // await axios
      //   .get(localUrl, { headers: { Authorization: `Bearer ${state.token}` } })
      //   .then((resp) => {
      //     console.log(resp);
      // })
      // .catch((e) => {
      //   console.log(e);
      // });
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      commit("LOGOUT_USER");
      router.push("login");
    },
  },
  mutations: {
    SET_USER: (state, payload) => {
      state.user = payload;
      console.log("user has been set");
      router.push("/");
    },
    LOGOUT_USER: (state) => {
      state.user = null;
      console.log("logged out");
    },
  },
  modules: {
    auth,
  },
});
