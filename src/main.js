import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import axios from "axios";
// const user = localStorage.getItem("user");
Vue.config.productionTip = false;
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common.Accept = "application/json";

new Vue({
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
