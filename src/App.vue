<template>
  <!-- App.vue -->

  <v-app style="background-color: #e5e5e5" v-resize="onResize">
    <v-app-bar app v-if="getUser !== null">
      <v-app-bar-nav-icon
        v-if="isMobile"
        @click="drawer = !drawer"
        color="black"
      />
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/images/logo.svg"
          transition="scale-transition"
          width="140"
        />
      </div>

      <v-spacer></v-spacer>
      <v-menu left offset-y bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-card rounded="circle">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </v-card>
        </template>

        <v-list>
          <v-list-item v-for="n in 1" :key="n" @click="logout()">
            <v-icon>mdi-logout</v-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      v-if="getUser !== '' && getUser !== null"
      app
    >
      <!-- -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Shifl Chat </v-list-item-title>
          <v-list-item-subtitle> Application </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import DrawerMenu from "./components/DrawerMenu.vue";

import { mapGetters, mapActions } from "vuex";
export default {
  components: {},
  data() {
    return {
      drawer: null,
      isMobile: false,
      items: [
        { title: "Chat", icon: "mdi-view-dashboard", route: "login" },
        { title: "Home", icon: "mdi-image", route: "chat" },
        { title: "Profile", icon: "mdi-border-color", route: "profile" },
      ],
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  methods: {
    ...mapActions(["logoutUser"]),
    onResize() {
      if (window.innerWidth < 1024) {
        this.isMobile = true;
        this.activeColor = "#0171A1";
      } else {
        this.isMobile = false;
        this.activeColor = "white";
      }

      if (window.innerWidth > 1023 && window.innerWidth < 1201) {
        this.isTablet = true;
      } else {
        this.isTablet = false;
      }
    },
    logout() {
      this.logoutUser();
      this.$router.push("login");
    },
  },
};
</script>

<style lang="scss" scoped>
.hideElement {
  // background-color: #e5e5e5;
  background-color: red;
}
.changeBackground {
  background-color: red;
}
.textCheck {
  font-size: 20px;
  color: blue;
  background-color: green;
}
</style>
