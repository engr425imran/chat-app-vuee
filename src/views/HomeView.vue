<template>
  <div>
    <h2>Home view xx ss dd dd</h2>

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
          <button @click="check('SUPERHERO1')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO1</p>
              <img src="@/assets/users/user1.jpg" height="40px" />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button @click="check('SUPERHERO2')" style="width: 100%">
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
          <button @click="check('SUPERHERO3')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO3</p>
              <img src="@/assets/users/user1.jpg" height="40px" />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button @click="check('SUPERHERO4')" style="width: 100%">
            <v-card class="text-center card-body" elevation="2" tile>
              <p>SUPERHERO4</p>
              <img src="@/assets/images/avatars/avatar.jpeg" height="40px" />
            </v-card>
          </button>
        </v-col>
        <v-col cols="4">
          <button @click="check('SUPERHERO5')" style="width: 100%">
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
import router from "@/router";
import { CometChat } from "@cometchat-pro/chat";

export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    check(name) {
      this.loading = true;
      var UID = name;
      var authKey = "25226e843db138c8148e28a0881aaa56ab0bbbf6";

      CometChat.getLoggedinUser().then(
        (user) => {
          if (!user) {
            CometChat.login(UID, authKey).then(
              (user) => {
                localStorage.setItem("user", JSON.stringify(user));
                this.loading = false;

                router.push("/chatUIPage");
              },
              (error) => {
                this.loading = false;

                console.log("Login failed with exception:", { error });
              }
            );
          }
        },
        (error) => {
          console.log("Something went wrong", error);
        }
      );
    },
  },
};
</script>

<style></style>
