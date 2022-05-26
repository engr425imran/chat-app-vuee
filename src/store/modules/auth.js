import axios from "axios";
const localUrl = process.env.API_URL;
// const REMOTE_API = process.env.REMOTE_API;
// import router from "../../router";
const state = {
  user: localStorage.getItem("user") || null,
};

const getters = {
  getUser: (state) => state.user,
};

const actions = {
  checkUser: ({ commit }) => {
    const user = localStorage.getItem("user");
    if (user) {
      commit("SET_USER", user);
    }
  },
  loginUser: async ({ commit }, payload) => {
    const body = {
      email: payload.email,
      password: payload.password,
    };
    axios
      // .post("https://sheltered-dusk-23828.herokuapp.com/api/user/login", body)
      .post("http://localhost:8000/api/user/login", body)
      .then((res) => {
        commit("SET_USER", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem(
          "access_token",
          JSON.stringify(res.data.access_token)
        );
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
};

const mutations = {
  SET_USER: (state, payload) => {
    state.user = payload.user;
    state.token = payload.token;
  },
  LOGOUT_USER: (state) => {
    state.user = null;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
