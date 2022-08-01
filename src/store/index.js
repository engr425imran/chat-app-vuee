import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import messages from "./modules/subMessage/messages";
import conversation from "./modules/coversation";
import register from "./modules/register";
import users from "./modules/users";
import listFriends from "./modules/listFriends";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    register,
    auth,
    messages,
    conversation,
    users,
    listFriends,
  },
});
