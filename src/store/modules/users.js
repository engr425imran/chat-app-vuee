import { CometChat } from "@cometchat-pro/chat";

const state = {
  irma: "khan",
};
const getters = {
  getIk: (state) => state.irma,
};
const actions = {
  displayUserss: ({ commit, rootGetters }) => {
    commit("conversation/SET_CONVERSATION_TAB_SELECTED", false, { root: true });
    commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", true, {
      root: true,
    });

    const users = new CometChat.UsersRequestBuilder().setLimit(5);
    const usersRequest = users.build();
    usersRequest
      .fetchNext()
      .then((usersList) => {
        var newRooms = [];
        var roomObject;
        // console.log(usersList);
        usersList.forEach((element) => {
          roomObject = {};
          roomObject["roomId"] = element.uid;
          roomObject["roomName"] = element.name;
          roomObject["avatar"] = element.avatar;
          roomObject["uid"] = element.uid;
          roomObject["users"] = [
            {
              _id: rootGetters["home/getCometUser"].uid,
              username: rootGetters["home/getCometUser"].name,
              avatar: rootGetters["home/getCometUser"].avatar,
              status: {
                state: rootGetters["home/getCometUser"].status,
                lastChanged: "live",
              },
            },
            {
              _id: element.uid,
              username: element.name,
              avatar: element.avatar,
              status: {
                state: element.status,
                lastChanged: new Date(
                  element.lastActiveAt * 1000
                ).toLocaleString("en-us", {
                  hour: "numeric",
                  minute: "numeric",
                }),
              },
            },
          ];
          newRooms.push(roomObject);
        });
        commit("conversation/SET_ROOMS", newRooms, { root: true });
      })
      .catch((e) => {
        console.log(e);
        commit("conversation/SET_INITIAL_STAGE_ROOMS_LOADING", false, {
          root: true,
        });
      });
  },
  checl() {
    console.log("dispathx has been done !");
  },
};
const mutations = {
  SET_IRMA: (state, payload) => {
    console.log("commme");
    state.irma = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
