import router from "@/router";
import { CometChat } from "@cometchat-pro/chat";
const VUE_APP_API_URL = process.env.VUE_APP_BACKEND_URL;

import axios from "axios";
const authKey = process.env.VUE_APP_COMET_AUTH_KEY;

const state = {
  image: "",
};

const getters = {
  getImage: (state) => state.image,
};

const actions = {
  registerUser: async ({ commit, dispatch }, payload) => {
    commit("auth/SET_LOADING_STATUS", true, { root: true });
    commit("auth/SET_DISABLED_INPUT", true, { root: true });
    await axios
      .post(`${VUE_APP_API_URL}/chat/user/create`, payload)
      .then((res) => {
        console.log(res.data, "User Registed With backend");
        commit("auth/SET_ACCESS_TOKEN", res.data.token, { root: true });
        commit("auth/SET_DISABLED_INPUT", false, { root: true });
        localStorage.setItem("access_token", res.data.token);
        dispatch("regiterUserCometChat", res.data.user);
      })
      .catch((error) => {
        if (error.response.data.error["password"]) {
          commit(
            "auth/SET_ERROR_MESSAGE",
            error.response.data.error["password"][0],
            {
              root: true,
            }
          );
        }
        if (error.response.data.error["email"]) {
          commit(
            "auth/SET_ERROR_MESSAGE",
            error.response.data.error["email"][0],
            {
              root: true,
            }
          );
        }
        commit("auth/SET_LOADING_STATUS", false, { root: true });
        commit("auth/SET_DISABLED_INPUT", false, { root: true });
      });
  },
  regiterUserCometChat({ commit, dispatch }, payload) {
    commit("auth/SET_LOADING_STATUS", true, { root: true });
    const avatar = payload.avatar;
    var UID = payload.uid;
    var name = payload.first_name + payload.last_name;
    var user = new CometChat.User(UID);

    user.setName(name);
    user.setAvatar(avatar);

    CometChat.createUser(user, authKey).then(
      (user) => {
        console.log(user, "User Registed With CometChat");
        const User = { ...payload, ...user };
        dispatch("loginUserToCometChat", User);
      },
      (error) => {
        commit("auth/SET_LOADING_STATUS", false, { root: true });
        commit("auth/SET_DISABLED_INPUT", false, { root: true });

        console.log("error", error);
      }
    );
  },
  loginUserToCometChat({ dispatch }, payload) {
    var UID = payload.uid;
    CometChat.getLoggedinUser().then(
      (user) => {
        if (!user) {
          CometChat.login(UID, authKey).then(
            (user) => {
              const biaUser = { ...payload, ...user };
              dispatch("addCometChatRecordToDb", biaUser);
            },
            (error) => {
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
  addCometChatRecordToDb({ commit, rootGetters }, payload) {
    const token = rootGetters["auth/getToken"];
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = {
      cometChatAuthToken: payload.authToken,
    };
    axios
      .post(VUE_APP_API_URL + "/chat/user/addCometChatInfo", data, config)
      .then((res) => {
        let fullUserObjectWithCometChatAuthToken = res.data.user;
        const user = { ...payload, ...fullUserObjectWithCometChatAuthToken };
        localStorage.setItem("user", JSON.stringify(user));
        commit("auth/SET_USER", user, { root: true });
        commit("auth/SET_DISABLED_INPUT", false, { root: true });
        commit("auth/SET_LOADING_STATUS", false, { root: true });

        console.log(user);
        router.push("/");
      })
      .catch((e) => {
        commit("auth/SET_LOADING_STATUS", false, { root: true });
        console.log(e);
      });
  },
};
const mutations = {
  SET_IMAGE: (state, payload) => {
    state.image = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
