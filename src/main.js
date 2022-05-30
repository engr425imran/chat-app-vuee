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
  router,
  store,
  vuetify,
  created() {
    console.log(store.state.auth.user);
    if (store.state.auth.user) {
      router.push("/");
    }
  },
  render: (h) => h(App),
}).$mount("#app");
