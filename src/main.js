import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import axios from "axios";
// const user = localStorage.getItem("user");
import { CometChat } from "@cometchat-pro/chat";
Vue.config.productionTip = false;
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common.Accept = "application/json";

new Vue({
  store,
  vuetify,
  router,
  mounted() {
    let appID = "211689aa8d66a78c";
    let region = "us";
    let appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .autoEstablishSocketConnection(true)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        console.log("Initialization completed successfully");
      },
      (error) => {
        console.log("Initialization failed with error:", error);
      }
    );
  },
  render: (h) => h(App),
}).$mount("#app");
