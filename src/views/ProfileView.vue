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
          src="@/assets/images/logo.png"
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
                src="@/assets/images/avatar.jpeg"
              ></v-img>
            </div>
          </div>
          <input type="file" class="button-avatar" />
          <!-- <input type="file" class="custom-file-input" /> -->
          <div style="margin-top: 24px">
            <input
              :value="getUser.email"
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
          <button class="button-submit">
            <span>
              <v-progress-circular
                :size="15"
                color="#fff"
                :width="3"
                indeterminate
                v-if="getLoadingStatus"
                style="margin-right: 3px"
              >
              </v-progress-circular>
              Submit
            </span>
          </button>
        </v-card>
      </v-sheet>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser", "getLoadingStatus"]),
  },
  methods: {},
  created() {},
};
</script>

<style scoped>
.button-avatar {
  color: transparent;
}

.button-avatar::-webkit-file-upload-button {
  margin: 5px 89px;
  cursor: pointer;
  height: 40px;
  width: 127px;
  padding: 12px;
  background-color: #fff;
  color: #0171a1;
  border: 1px solid #0171a1;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 400, Regular;
  line-height: 14px;
}
/* .button-avatar::before {
  visibility: hidden;
  margin-top: 7px;
  content: "Select some files";
  display: inline-block;
  cursor: pointer;
  height: 40px;
  width: 127px;
  padding: 12px;
  color: #0171a1;
  border: 1px solid #0171a1;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 400, Regular;
  line-height: 14px;
} */

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
  margin-top: 14px;
  font-family: "Poppins";
  font-weight: 400, Regular;
  font-size: 12px;
  line-height: 19px;
  width: 100%;
  padding: 6px;
  background-color: #0171a1;
  color: #fff;
  border-radius: 5px;
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
.card-body {
  padding: 20px;
}
</style>
