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
          :max-height="490"
          :max-width="$vuetify.breakpoint.xs ? 330 : 489"
          class="text-center card-body"
          outlined
          elevation="0"
        >
          <form @submit.prevent="login">
            <p class="heading">Sign in to Shifl chat bot</p>
            <input
              type="button"
              value="Google Account"
              class="google-signin-button"
            />
            <div
              class="d-flex justify-center align-center"
              style="margin-top: 25px"
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
            <button
              v-if="!loginWithNumber"
              type="button"
              @click="showLoginWithNumber"
              class="loginWithNumberBtn"
            >
              Login With Number
            </button>
            <button
              v-else
              class="loginWithNumberBtn"
              type="button"
              @click="showLoginWithEmailAndPassword"
            >
              Login With email
            </button>

            <div
              v-if="loginWithNumber"
              class="justify-center"
              style="margin-top: 12px"
            >
              <input
                v-model="numberToLogin"
                type="text"
                class="card-input"
                placeholder="Enter Number"
                :disabled="getDisableInput"
                autocomplete="trrr"
              />
            </div>
            <div v-else style="margin-top: 20px">
              <div class="justify-center">
                <input
                  v-model="user.email"
                  type="email"
                  class="card-input"
                  placeholder="Enter email Address"
                  :disabled="getDisableInput"
                />
              </div>
              <div class="justify-center" style="margin-top: 12px">
                <input
                  v-model="user.password"
                  type="password"
                  class="card-input"
                  placeholder="Enter Password"
                  :disabled="getDisableInput"
                  autocomplete="trrr"
                />
              </div>
            </div>
            <p style="margin-top: 2px; color: #ea3f3f; font-size: 13px">
              {{ getErrorMessage }}
            </p>
            <button
              type="submit"
              :disabled="getDisableInput"
              class="button-submit"
            >
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
          </form>

          <p style="margin-top: 10px">
            Create A New Account ?<span class="change-submit"
              ><button value="Register" @click="changeToRegister()">
                Register
              </button></span
            >
          </p>
        </v-card>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>
import router from "@/router";
// import Swal from "sweetalert2";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      numberToLogin: "",
      loginWithNumber: false,
      user: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapGetters("auth", [
      "getLoadingStatus",
      "getErrorMessage",
      "getDisableInput",
    ]),
  },
  methods: {
    ...mapActions("auth", ["loginUser", "loginWithPhoneNumber", "resetState"]),
    login() {
      if (this.loginWithNumber) {
        this.loginWithPhoneNumber(this.numberToLogin);
        return;
      }
      this.loginUser(this.user);
    },
    changeToRegister() {
      router.push("/register");
    },
    showLoginWithNumber() {
      this.resetState();
      this.loginWithNumber = true;
    },
    showLoginWithEmailAndPassword() {
      this.resetState();
      this.loginWithNumber = false;
    },
  },
};
</script>

<style scoped>
@import "@/assets/scss/Views/chatLogin.scss";
.loginWithNumberBtn {
  color: #0271a1;
  font-family: "Times New Roman", Times, serif;
  text-decoration: underline;
  font-weight: 700;
}
</style>
