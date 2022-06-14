<template>
  <div>
    <div
      class="app-container"
      :class="{ 'app-mobile': isDevice, 'app-mobile-dark': theme === 'dark' }"
    >
      <span
        v-if="showOptions"
        class="user-logged"
        :class="{ 'user-logged-dark': theme === 'dark' }"
      >
        Logged as
      </span>
      <select>
        <option>
          {{ currentUser.uid }}
        </option>
      </select>
      <!-- <select v-if="showOptions" v-model="currentUserId">
        <option v-for="user in users" :key="user._id" :value="user._id">
          {{ user.username }}
        </option>
      </select> -->

      <div v-if="showOptions" class="button-theme">
        <button class="button-light" @click="themeChange()">theme</button>
        <button class="button-dark" @click="logout()">logout</button>
        <!-- <button class="button-dark" @click="theme = 'dark'" @click="logout()">Dark</button> -->
        <v-card
          rounded="circle"
          :img="currentUser.avatar"
          height="40"
          style="margin-left: 10px"
        >
          <button class="button-githuxb">
            <!-- <img :src="currentUser.avatar" height="40px" /> -->
          </button>
        </v-card>
      </div>

      <chat-container
        v-if="showChat"
        :theme="theme"
        :is-device="isDevice"
        @show-demo-options="showDemoOptions = $event"
        :currentUser="currentUser"
      />
      <div class="version-container">v1.0.0</div>
    </div>
  </div>
</template>
<script>
import router from "@/router";
import ChatContainer from "../chat/ChatContainer";
import { CometChat } from "@cometchat-pro/chat";

export default {
  components: {
    ChatContainer,
  },
  data() {
    return {
      theme: true,
      showChat: true,
      currentUser: null,
      username: localStorage.getItem("username") || "Not Logged In",
      isDevice: false,
      showDemoOptions: true,
      updatingData: false,
    };
  },
  computed: {
    showOptions() {
      return !this.isDevice || this.showDemoOptions;
    },
  },
  methods: {
    themeChange() {
      this.theme = !this.theme;
      console.log(this.theme);
      // this.theme = !this.theme;
    },
    logout() {
      CometChat.logout().then(
        () => {
          console.log("Logout completed successfully");
          localStorage.removeItem("user");
          router.push("/");
        },
        (error) => {
          console.log("Logout failed with exception:", { error });
        }
      );
    },
    getUserFromStorage() {
      const user = localStorage.getItem("user");
      if (user) {
        const newuser = JSON.parse(user);
        this.currentUser = newuser;
      }
    },
  },
  watch: {
    currentUserId() {
      this.showChat = false;
      console.log("user dy chango ko kana");
      setTimeout(() => (this.showChat = true), 150);
    },
  },
  mounted() {
    this.isDevice = window.innerWidth < 500;
    window.addEventListener("resize", (ev) => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500;
    });
  },
  created() {
    this.getUserFromStorage();
  },
};
</script>

<style lang="scss">
@import "@/css/chatView.scss";
</style>
