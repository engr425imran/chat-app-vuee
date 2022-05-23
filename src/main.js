import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import axios from "axios";

Vue.config.productionTip = false;
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common.Accept = "application/json";

new Vue({
  router,
  store,
  vuetify,
  created() {
    store.dispatch("checkUser");
  },
  render: (h) => h(App),
}).$mount("#app");
