<template>
  <div>
    <h2>Please Select One Of dummy Account</h2>

    <v-container>
      <div style="margin-left: 50%">
        <v-progress-circular
          v-if="getLoading"
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-row style="margin-top: 30px">
        <v-col cols="4">
          <button @click="loginCometChat('SUPERHERO1')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO1</p>
              <img src="@/assets/users/user1.jpg" height="40px" />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button @click="loginCometChat('SUPERHERO2')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO2</p>
              <img
                src="@/assets/images/avatars/avatarLuke.jpeg"
                height="40px"
              />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button @click="loginCometChat('SUPERHERO3')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO3</p>
              <img src="@/assets/users/user1.jpg" height="40px" />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button @click="loginCometChat('SUPERHERO4')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO4</p>
              <img src="@/assets/images/avatars/avatar.jpeg" height="40px" />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button @click="loginCometChat('SUPERHERO5')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO5</p>
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
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters("home", ["getLoading"]),
  },
  methods: {
    ...mapActions("home", ["check"]),
    loginCometChat(name) {
      this.check(name);
    },
  },
};
</script>

<style></style>
