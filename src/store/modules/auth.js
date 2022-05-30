import router from "@/router";
import axios from "axios";
// const localUrl = process.env.API_URL;
// const REMOTE_API = process.env.REMOTE_API;

const state = {
  user: localStorage.getItem("user") || null,
  token: localStorage.getItem("access_token")
    ? JSON.parse(localStorage.getItem("access_token"))
    : null,
  loadingStatus: false,
  imran: null,
};

const getters = {
  getUser: (state) => state.user,
  getLoadingStatus: (state) => state.loadingStatus,
  getimran: (state) => state.imran,
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
    axios
      .post("http://localhost:8000/api/user/login", body)
      .then((res) => {
        commit("SET_USER", res.data);
        localStorage.setItem("user", JSON.stringify(body));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem(
          "access_token",
          JSON.stringify(res.data.access_token)
        );
        commit("SET_LOADING_STATUS", false);
        commit("SET_IMRAN", "olamba");
      })
      .catch((e) => {
        console.log(e);
      });
  },
  logoutUser: async ({ commit, state }) => {
    await axios
      .get("http://localhost:8000/api/user/logout", {
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
    console.log("user has been set");
  },
  LOGOUT_USER: (state) => {
    state.user = null;
  },
  SET_LOADING_STATUS: (state, payload) => {
    state.loadingStatus = payload;
  },
  SET_IMRAN: (state, payload) => {
    state.imran = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
