<template>
  <v-container class="d-flex main-container justify-center align-center" fluid>
    <div>
      <div class="d-flex justify-center">
        <img
          class=""
          alt="shfil logo"
          width="180px"
          height="40px"
          src="@/assets/images/logo.png"
        />
      </div>
      <v-sheet style="margin-top: 20px" outlined color="#0171A1" rounded>
        <v-card
          :max-height="620"
          :min-width="$vuetify.breakpoint.xs ? 350 : 510"
          class="text-center card-body"
          outlined
          elevation="0"
        >
          <p class="heading">Register To Shifl Chat bot</p>
          <p>
            already have account ?
            <span class="change-submit"
              ><input type="button" value="Login" @click="changeToLogin()"
            /></span>
          </p>
          <div>
            <div class="justify-center">
              <input
                v-model="user.firstName"
                type="text"
                class="card-input"
                placeholder="Enter First Name"
                :disabled="getDisableInput"
              />
            </div>
            <div class="justify-center">
              <input
                v-model="user.lastName"
                type="text"
                class="card-input"
                placeholder="Enter Last Name"
                :disabled="getDisableInput"
              />
            </div>
            <div class="justify-center">
              <input
                v-model="user.email"
                type="email"
                class="card-input"
                placeholder="Enter email Address"
                :disabled="getDisableInput"
              />
            </div>
            <div class="justify-center">
              <input
                v-model="user.password"
                type="password"
                class="card-input"
                placeholder="Enter Password"
                :disabled="getDisableInput"
              />
            </div>
            <div class="justify-center">
              <input
                v-model="user.password_confirmation"
                type="password"
                class="card-input"
                placeholder="Confirm Password"
                :disabled="getDisableInput"
              />
            </div>
            <div class="justify-center">
              <input
                v-model="user.countryCode"
                type="text"
                class="card-input"
                placeholder="country code"
                :disabled="getDisableInput"
              />
            </div>
            <div class="justify-center">
              <input
                v-model="user.number"
                type="number"
                class="card-input"
                placeholder="Number"
                :disabled="getDisableInput"
              />
            </div>
            <div class="justify-center">
              <input type="file" class="card-input" @change="uploadImage" />
            </div>
          </div>
          <p style="margin-top: 8px; color: #ea3f3f; font-size: 13px">
            {{ getErrorMessage }}
          </p>
          <button @click="registerUserTo()" class="button-submit">
            <v-progress-circular
              :size="15"
              color="#fff"
              :width="3"
              indeterminate
              v-if="getLoadingStatus"
              style="margin-right: 3px"
            >
            </v-progress-circular>
            <span> Register </span>
          </button>
        </v-card>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import router from "@/router";

export default {
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password_confirmation: "",
        countryCode: "",
        number: "",
        avatar: null,
      },
    };
  },
  computed: {
    ...mapGetters("auth", [
      "getLoadingStatus",
      "getErrorMessage",
      "getUser",
      "getDisableInput",
    ]),
    ...mapGetters("register", ["getImage"]),
  },
  methods: {
    ...mapActions("register", ["registerUser", "regiterUserCometChat"]),
    registerUserTo() {
      let data = new FormData();
      data.append("firstName", this.user.firstName);
      data.append("lastName", this.user.lastName);
      data.append("email", this.user.email);
      data.append("password", this.user.password);
      data.append("password_confirmation", this.user.password_confirmation);
      data.append("countryCode", this.user.countryCode);
      data.append("number", this.user.number);
      data.append("avatar", this.user.avatar);
      this.registerUser(data);
    },
    registerToComet() {
      this.regiterUserCometChat();
    },
    previewFiles(event) {
      const image = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.previewImage = e.target.result;
        console.log(this.previewImage);
      };
    },
    changeToLogin() {
      router.push("/login");
    },
    cb() {
      const reader = new FileReader();
      console.log(reader);
      const path = require("@/assets/logo.png");
      console.log(path);

      const edit = reader.readAsDataURL(path);
      console.log(edit);

      const pathh = require("@/assets/logo.png");
      console.log(pathh);
    },
    uploadImage(event) {
      this.user.avatar = event.target.files[0];
    },
  },
};
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
input[type="file"] {
  padding-bottom: 20px;
  /* margin-bottom: 20px; */
}
.main-container {
  background-color: #e5e5e5;
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
}
.card-main {
  border-width: 1;
  border-color: black;
}
.card-input {
  margin-top: 15px;
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
  margin-top: 42px;
  width: 100%;
  height: 40px;
  background: #ffffff;
  color: #0171a1;
  border: 1px solid #0171a1;
  border-radius: 5px;
}
.heading {
  margin-top: 10px;
  color: #58677a;
  font-family: "Inter";
  font-size: 22px;
  font-weight: 600, semi Bold;
  line-height: 26px;
}
.card-body {
  padding: 15px;
}
.change-submit {
  font-size: 18px;
  font-weight: 700;
  color: #db6969;
}
</style>
