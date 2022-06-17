const state = {
  grandC: "roos taylor",
};
const getters = {
  getGrandC: (state) => state.grandC,
};
const actions = {
  changeInGrandParent: ({ dispatch }) => {
    dispatch("imran/dispalyName", "Roos Taylor", { root: true });
  },
};
const mutations = {};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
