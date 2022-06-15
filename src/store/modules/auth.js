import router from "@/router";
import axios from "axios";
const VUE_APP_LOCAL_APP_URL = process.env.VUE_APP_HEROKU_APP_URL;
// const VUE_APP_LOCAL_APP_URL = process.env.VUE_APP_LOCAL_APP_URL;

const state = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: localStorage.getItem("access_token")
    ? JSON.parse(localStorage.getItem("access_token"))
    : null,
  loadingStatus: false,
  errorMessage: "sss",
};

const getters = {
  getUser: (state) => state.user,
  getLoadingStatus: (state) => state.loadingStatus,
  getErrorMessage: (state) => state.errorMessage,
};

const actions = {
  checkUser: ({ commit }) => {
    const user = localStorage.getItem("user");
    if (user) {
      commit("SET_USER", user);
    }
  },
  // login: async ({ commit, dispatch }) => {
  //   return new Promise((resolve, reject) => {
  //     axios.defaults.withCredentials = true;
  //     axios.post(`/refresh-token`,{},
  //         {
  //           withCredentials: true,
  //           credentials: "include",
  //         }
  //       )
  //       .then((res) => {
  //         if (res.status === 200) {
  //           const expiresAt = new Date(
  //             new Date().getTime() + (res.data.expiresIn - 2) * 1000
  //           );
  //           localStorage.setItem("user_token", res.data.token);
  //           localStorage.setItem("expiresAt", expiresAt); // optional
  //           commit("SET_TOKEN", {
  //             token: res.data.token,
  //             expiresAt: expiresAt,
  //           });
  //           dispatch("fetchUser");
  //         }
  //         resolve(res);
  //        })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // },
  loginUser: async ({ commit }, payload) => {
    commit("SET_LOADING_STATUS", true);
    const body = {
      email: payload.email,
      password: payload.password,
    };
    await axios
      .post(`${VUE_APP_LOCAL_APP_URL}/user/login`, body)
      // .get(`${APIBaseUrl}/getyards`)

      // .post("http://localhost:8000/api/user/login", body)
      .then((res) => {
        commit("SET_USER", res.data);
        localStorage.setItem("user", JSON.stringify(body));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem(
          "access_token",
          JSON.stringify(res.data.access_token)
        );
        commit("SET_LOADING_STATUS", false);
      })
      .catch((error) => {
        if (error.response.data.message)
          commit("SET_ERROR_MESSAGE", error.response.data.message);
        commit("SET_LOADING_STATUS", false);
      });
  },
  logoutUser: async ({ commit, state }) => {
    await axios
      .get(`${VUE_APP_LOCAL_APP_URL}/user/logout`, {
        headers: { Authorization: `Bearer ${state.token}` },
      })
      .then(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        commit("LOGOUT_USER");
        router.push("/login");
      })
      .catch((e) => {
        console.log(e);
      });
  },
};

const mutations = {
  SET_USER: (state, payload) => {
    state.user = payload.user;
    state.token = payload.access_token;
  },
  LOGOUT_USER: (state) => {
    state.user = null;
  },
  SET_LOADING_STATUS: (state, payload) => {
    state.loadingStatus = payload;
  },
  SET_ERROR_MESSAGE: (state, payload) => {
    state.errorMessage = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
