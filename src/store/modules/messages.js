// import router from "@/router";
const state = {
  messges: "www",
  user: "sssss",
  loading: false,
};
const getters = {
  getMessages: (state) => state.messges,
  getUser: (state) => state.user,
  getLoading: (state) => state.loading,
};
const actions = {
  callApi: ({ commit }) => {
    console.log("api get");
    commit("SET_MESSAGES", "tol gam");
  },
};
const mutation = {
  SET_MESSAGES(state, payload) {
    state.messges = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutation,
};
