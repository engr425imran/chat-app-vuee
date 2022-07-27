import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// import VueSweetalert2 from "vue-sweetalert2";

const appID = process.env.VUE_APP_COMET_APP_ID;
const region = process.env.VUE_APP_COMET_REGION;
// import axios from "axios";
// const user = localStorage.getItem("user");
import { CometChat } from "@cometchat-pro/chat";
Vue.config.productionTip = false;
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common.Accept = "application/json";
// Vue.use(VueSweetalert2);

new Vue({
  store,
  vuetify,
  router,
  mounted() {
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
