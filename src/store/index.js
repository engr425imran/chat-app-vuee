import Vue from "vue";
import Vuex from "vuex";
import router from "../router/index";

const localUrl = process.env.API_URL;
// const REMOTE_API = process.env.REMOTE_API;

Vue.use(Vuex);
import axios from "axios";
export default new Vuex.Store({
  state: {
    user: null,
    token: null,
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
    loginUser: async ({ commit }, payload) => {
      console.log(commit);
      const body = {
        email: payload.email,
        password: payload.password,
      };
      axios
        .post("https://sheltered-dusk-23828.herokuapp.com/api/user/login", body)
        // .post("http://localhost:8000/api/user/login", body)
        .then((res) => {
          commit("SET_USER", res.data);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem(
            "access_token",
            JSON.stringify(res.data.access_token)
          );
          router.push("/");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    logoutUser: async ({ commit, state }) => {
      await axios
        .get(localUrl, { headers: { Authorization: `Bearer ${state.token}` } })
        .then((resp) => {
          console.log(resp);
        })
        .catch((e) => {
          console.log(e);
        });
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      commit("LOGOUT_USER");
    },
  },
  mutations: {
    SET_USER: (state, payload) => {
      state.user = payload.user;
      state.token = payload.token;
    },
    LOGOUT_USER: (state) => {
      state.user = null;
    },
  },
  modules: {},
});
