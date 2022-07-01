<template>
  <v-container class="d-flex main-container justify-center align-center" fluid>
    <div>
      <div class="d-flex justify-center">
        <img
          class=""
          alt="shfil logo"
          width="203px"
          height="50px"
          src="@/assets/images/logo.png"
        />
      </div>
      <v-sheet style="margin-top: 54px" outlined color="#0171A1" rounded>
        <v-card
          :max-height="480"
          :max-width="$vuetify.breakpoint.xs ? 340 : 489"
          class="text-center card-body"
          outlined
          elevation="0"
        >
          <p class="heading">Sign in to Shifl chat bot</p>
          <input
            type="button"
            value="Google Account"
            class="google-signin-button"
          />
          <div
            class="d-flex justify-center align-center"
            style="margin-top: 30px"
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
          <p style="margin-top: 8px; color: #ea3f3f; font-size: 13px">
            {{ getErrorMessage }}
          </p>
          <button @click="login()" class="button-submit">
            <v-progress-circular
              :size="15"
              color="#fff"
              :width="3"
              indeterminate
              v-if="getLoadingStatus"
              style="margin-right: 3px"
            >
            </v-progress-circular>
            <span> Login </span>
          </button>
          <p style="margin-top: 20px">
            Create A New Account ?<span class="change-submit"
              ><input
                type="button"
                value="Register"
                @click="changeToRegister()"
            /></span>
          </p>
        </v-card>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>
import router from "@/router";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      user: {
        email: "",
        // email: "imran@test.com",
        // password: "password",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["getLoadingStatus", "getErrorMessage"]),
  },
  methods: {
    ...mapActions("auth", ["loginUser"]),
    login() {
      this.loginUser(this.user);
    },
    changeToRegister() {
      router.push("/register");
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
  margin-top: 5px;
  width: 100%;
  padding: 6px;
  background-color: #0171a1;
  color: #fff;
  border-radius: 5px;
}

.google-signin-button {
  margin-top: 30px;
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
  padding: 25px;
}
.change-submit {
  font-size: 20px;
  margin-left: 15px;
  font-weight: 700;
  color: #db6969;
}
</style>
