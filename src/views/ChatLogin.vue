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
          :min-height="456"
          :max-width="$vuetify.breakpoint.xs ? 300 : 484"
          class="text-center card-body"
          outlined
          elevation="0"
        >
          <p class="heading">Sign in to Shifl chat bot</p>
          <input
            @click="logoutUser()"
            type="button"
            value="Google Account"
            class="google-signin-button"
          />
          <div
            class="d-flex justify-center align-center"
            style="margin-top: 42px"
          >
            <hr style="width: 188px; border-top: 1px solid #c4c4c4" />
            <span
              style="
                margin: 1px 10px;
                font-size: 10px;
                font-weight: 400;
                font-family: 'Inter';
              "
              >or</span
            >
            <hr style="width: 188px; border-top: 1px solid #c4c4c4" />
          </div>
          <div style="margin-top: 43px">
            <div class="justify-center">
              <input
                v-model="user.email"
                type="text"
                class="card-input"
                placeholder="Enter email Address"
              />
            </div>
            <div class="justify-center" style="margin-top: 12px">
              <input
                v-model="user.password"
                type="text"
                class="card-input"
                placeholder="Enter Password"
              />
            </div>
          </div>
          <input
            type="button"
            value="Login"
            @click="login"
            class="button-submit"
          />
        </v-card>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>
// import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      user: {
        // email: "",
        email: "test@shifl.com",
        password: "password",
        // password: "",
      },
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  methods: {
    ...mapActions(["loginUser", "checkUser", "logoutUser"]),
    login() {
      this.loginUser(this.user);
      this.$router.push("/");
    },
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
  width: 100%;
  height: 40px;
  padding: 10px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
}
.button-submit {
  margin-top: 16px;
  width: 100%;
  padding: 6px;
  background-color: #0171a1;
  color: #fff;
  border-radius: 7px;
}

.google-signin-button {
  margin-top: 42px;
  width: 100%;
  height: 40px;
  background: #ffffff;
  color: #0171a1;
  border: 1px solid #0171a1;
  border-radius: 5px;
}
.heading {
  margin-top: 43px;
  color: #58677a;
  font-family: "Inter";
  font-size: 22px;
  font-weight: 600, semi Bold;
  line-height: 26px;
}
.card-body {
  padding: 15px;
}
</style>
