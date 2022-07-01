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
          {{ getUser.first_name }}
        </option>
      </select>
      <div v-if="showOptions" class="button-theme">
        <button class="button-light" @click="themeChange()">theme</button>
        <!-- <button class="button-dark" @click="logoutUser()">logout</button> -->
        <v-card
          :img="getUser.avatar"
          rounded="circle"
          height="40"
          style="margin-left: 10px"
        >
          <button class="button-githuxb"></button>
        </v-card>
      </div>

      <chat-container
        v-if="showChat"
        :theme="theme"
        :is-device="isDevice"
        @show-demo-options="showDemoOptions = $event"
        :currentUser="getUser"
      />
      <div class="version-container">v1.0.0</div>
    </div>
  </div>
</template>
<script>
import ChatContainer from "../chat/ChatContainer";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    ChatContainer,
  },
  data() {
    return {
      theme: true,
      showChat: true,
      currentUser: null,
      isDevice: false,
      showDemoOptions: true,
      updatingData: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
    showOptions() {
      return !this.isDevice || this.showDemoOptions;
    },
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
    themeChange() {
      this.theme = !this.theme;
    },
  },
  mounted() {
    this.isDevice = window.innerWidth < 500;
    window.addEventListener("resize", (ev) => {
      if (ev.isTrusted) this.isDevice = window.innerWidth < 500;
    });
  },
};
</script>

<style lang="scss">
@import "@/css/chatView.scss";
</style>
