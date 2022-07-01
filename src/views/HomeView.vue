<template>
  <div>
    <h2>Here Is the Home Page For User</h2>

    <v-container>
      <div style="margin-left: 50%">
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-row style="margin-top: 30px">
        <v-col cols="4">
          <button style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>Some Random Text</p>
              <img src="@/assets/images/avatars/avatar.jpeg" height="40px" />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>Some Random Text</p>
              <img
                src="@/assets/images/avatars/avatarLeia.jpeg"
                height="40px"
              />
            </v-card>
          </button>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    // ...mapGetters("home", ["getLoading"]),
  },
  methods: {
    // ...mapActions("home", ["loginUsingCometChat"]),
    loginCometChat(name) {
      console.log(name);
      // this.loginUsingCometChat(name);
    },
  },
};
</script>

<style></style>
