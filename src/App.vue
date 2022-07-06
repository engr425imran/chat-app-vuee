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
          class="shrink ml-2"
          contain
          src="@/assets/images/logo.svg"
          transition="scale-transition"
          width="140"
        />
      </div>

      <v-spacer></v-spacer>
      <template v-if="!isMobile">
        <v-tabs
          background-color="light-blue darken-2"
          center-active
          dark
          align-with-title
        >
          <v-tabs-slider color="green"></v-tabs-slider>
          <v-tab v-for="item in items" :key="item.title" link :to="item.route">
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </template>
      <v-spacer></v-spacer>
      <!-- <a class="btn btn-primary" href="#signup">Sign Up</a> -->
      <v-menu left offset-y>
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

    <v-main>
      <!-- Provides the application the proper gutter -->
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import DrawerMenu from "./components/DrawerMenu.vue";
import Swal from "sweetalert2";

import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      drawer: false,
      isMobile: false,
      activeColor: "blue",
      items: [
        { title: "Home", icon: "mdi-image", route: "/" },
        { title: "Chat", icon: "mdi-view-dashboard", route: "chatUIPage" },
        { title: "Profile", icon: "mdi-border-color", route: "profileEdit" },
      ],
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
    onResize() {
      if (window.innerWidth < 1024) {
        this.isMobile = true;
        this.activeColor = "red";
      } else {
        this.isMobile = false;
        this.drawer = false;
        // this.activeColor = "white";
      }
      if (window.innerWidth > 1023 && window.innerWidth < 1201) {
        this.isTablet = true;
      } else {
        this.isTablet = false;
      }
    },
    logout() {
      Swal.fire({
        title: "Are you sure?",
        text: "Loggout Out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Logout!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.logoutUser();

          // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    },
  },
  // watch: {
  //   getUser(newQuestion) {
  //     if (newQuestion) this.$router.push("/");
  //   },
  // },
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
