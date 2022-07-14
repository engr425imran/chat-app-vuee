<template>
  <v-container class="d-flex main-container justify-center align-center" fluid>
    <div>
      <!-- <div class="d-flex justify-center">
        <img
          class=""
          alt="shfil logo"
          width="203px"
          height="50px"
          src="@/assets/images/logo.png"
        />
      </div> -->
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
                :src="updateAvatar ? updateAvatar : getUser.avatar"
              ></v-img>
            </div>
          </div>
          <input type="file" class="button-avatar" @change="setAvatar" />
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
          <button
            :disabled="getDisableInput"
            class="button-submit"
            @click="submit"
          >
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
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      updateAvatar: null,
      formAvatar: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser", "getLoadingStatus", "getDisableInput"]),
  },
  methods: {
    ...mapActions("users", ["updateUserProfile"]),
    submit() {
      const form = new FormData();
      form.append("avatar", this.formAvatar);
      this.updateUserProfile(form);
    },
    setAvatar(event) {
      const image = event.target.files[0];
      this.formAvatar = image;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.updateAvatar = e.target.result;
        console.log(e.target);
      };
    },
  },
  created() {},
};
</script>

<style scoped>
/* import  */
@import "@/assets/scss/Views/profileView.scss";
</style>
