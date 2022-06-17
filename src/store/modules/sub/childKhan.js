import grandChild from "./grandChild";
const state = {
  son: "smith jhon",
};
const getters = {
  getSon: (state) => state.son,
};
const actions = {
  changeNameParent: ({ dispatch }) => {
    dispatch("imran/dispalyName", "Stev Smith", { root: true });
  },
};
const mutations = {};
const modules = {
  grandChild,
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules,
};
