import axios from "axios";
const VUE_APP_API_URL = process.env.VUE_APP_BACKEND_URL;

const state = {};
const getters = {};
const actions = {
  getFriendsForUsers({ rootGetters }) {
    const data = {
      userUID: rootGetters["auth/getUser"].uid,
    };
    axios
      .post(`${VUE_APP_API_URL}/chat/user/listFriends`, data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
