<template>
  <v-container
    class="d-flex main-container justify-center align-center"
    fluid="true"
  >
    <div>
      <div class="d-flex justify-center">
        <img
          class=""
          alt="shfil logo"
          width="203px"
          height="50px"
          src="/logo.png"
        />
      </div>
      <v-sheet style="margin-top: 54px" outlined color="#0171A1" rounded>
        <v-card
          :min-height="476"
          :min-width="$vuetify.breakpoint.xs ? 300 : 484"
          class="text-center card-body"
          outlined
          elevation="0"
        >
          <p class="heading">Welcome to Shifl Chat</p>
          <p class="sub-heading">Lets setup your profile</p>
          <div class="d-flex justify-center align-center">
            <div class="justify-center">
              <v-img
                style="margin-top: 36px"
                alt="shfil logo"
                width="100"
                height="100"
                src="/avatar.jpeg"
              ></v-img>
            </div>
          </div>
          <input type="button" value="Change image" class="button-avatar" />
          <div style="margin-top: 24px">
            <input
              type="text"
              class="card-input"
              placeholder="Enter email Address"
            />
          </div>
          <div>
            <input
              type="text"
              style="margin-top: 14px"
              class="card-input"
              placeholder="Enter Password"
            />
          </div>
          <input
            type="button"
            value="Submit"
            @click="createUser()"
            class="button-submit"
          />
        </v-card>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";
export default {
  computed: {},
  methods: {
    createUser() {
      console.log("sss");
      let authKey = "9e4a3cb435c6ca190f905109eff575353ea21d3b";
      var uid = "user1";
      var name = "Kevin";

      var user = new CometChat.User(uid);
      user.setName(name);
      CometChat.createUser(user, authKey).then(
        (user) => {
          console.log("user created", user);
        },
        (error) => {
          console.log("error", error);
        }
      );
    },
  },
  created() {
    const appID = "209307dfb8b0f057";
    const region = "us";
    const appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();

    CometChat.init(appID, appSetting).then(
      () => {
        console.log("Initialization completed successfully");
        // You can now call login function.
      },
      (error) => {
        console.log("Initialization failed with error:", error);
        // Check the reason for error and take appropriate action.
      }
    );
  },
};
</script>

<style scoped>
.main-container {
  background-color: #e5e5e5;
  width: 100%;
  height: 100%;
}
.card-main {
  border-width: 1;
  border-color: black;
}
.card-input {
  width: 400px;
  height: 40px;
  padding: 10px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
}
.button-submit {
  margin-top: 14px;
  font-family: "Poppins";
  font-weight: 400, Regular;
  font-size: 12px;
  line-height: 19px;
  width: 400px;
  padding: 6px;
  background-color: #0171a1;
  color: #fff;
  border-radius: 7px;
}

.heading {
  margin-top: 33px;
  color: #58677a;
  font-family: Inter;
  font-size: 16px;
  font-weight: 600, semi Bold;
  line-height: 19px;
}
.sub-heading {
  margin-top: 5px;
  color: #0171a1;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400, Regular;
  line-height: 14px;
}
.button-avatar {
  margin-top: 7px;
  height: 40px;
  width: 127px;
  padding: 12px;
  color: #0171a1;
  border: 1px solid #0171a1;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 400, Regular;
  line-height: 14px;
}
</style>
