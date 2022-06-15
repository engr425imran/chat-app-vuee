const state = {
  errorMessage: "sss",
};

const getters = {
  getErrorMessage: (state) => state.errorMessage,
};

const actions = {
  check({ commit }) {
    console.log("sssss");
    commit("SET_ERROR", "ha g");
  },
};

const mutations = {
  SET_USER: (state, payload) => {
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
