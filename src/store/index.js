import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import messages from "./modules/messages";
import conversation from "./modules/coversation";
import home from "./modules/home";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    auth,
    messages,
    conversation,
    home,
  },
});
