import childKhan from "./childKhan";

const state = {
  name: "jhon doe",
};
const getters = {
  getName: (state) => state.name,
};
const actions = {
  dispalyName: ({ commit }, payload) => {
    console.log("zai mara ", payload);
    commit("NAME_CHANGE", payload);
  },
  checkState: ({ dispatch }) => {
    console.log("calling function");
    dispatch("checkReturn", "sanga ye")
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    // console.log(value);
  },
  checkReturn: (payload) => {
    return new Promise((resolve, reject) => {
      resolve(payload);
      reject("error occured");
    });
  },
};
const mutations = {
  NAME_CHANGE: (state, payload) => {
    state.name = payload;
  },
};

const modules = {
  childKhan,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules,
};
