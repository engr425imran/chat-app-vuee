<template>
  <chat-window
    :theme="dark"
    :responsive-breakpoint="122"
    :current-user-id="currentUserId"
    :rooms="rooms"
    :messages="messages"
    @send-message="sendMessage"
  />
</template>

<script>
import ChatWindow from "vue-advanced-chat";
import { mapGetters } from "vuex";

export default {
  components: {
    ChatWindow,
  },
  data() {
    return {
      rooms: [
        {
          roomId: 3,
          roomName: "Room 1",
        },
      ],
      messages: [
        {
          _id: 7890,
          indexId: 12092,
          content: "Message 1",
          senderId: 1234,
          username: "John Doe",
          avatar: "/avatar.jpeg",
          date: "13 November",
          timestamp: "10:20",
          system: false,
          saved: true,
          distributed: true,
          seen: true,
          deleted: false,
          failure: true,
          disableActions: false,
          disableReactions: false,
        },
      ],
      currentUserId: 4321,

      menuActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" },
      ],
    };
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  },
  methods: {
    check() {
      // const userbhai = localStorage.getItem("user");
    },
    async sendMessage({ content, roomId, replyMessage }) {
      const message = {
        sender_id: this.currentUserId,
        content,
        timestamp: new Date(),
      };
      console.log(message, roomId, replyMessage);
    },
  },
};
</script>

<style lang="scss">
body {
  background: #fafafa;
  margin: 0;
}
input {
  -webkit-appearance: none;
}
.app-container {
  font-family: "Quicksand", sans-serif;
  padding: 20px 30px 30px;
}
.app-mobile {
  padding: 0;
  &.app-mobile-dark {
    background: #131415;
  }
  .user-logged {
    margin: 10px 5px 0 10px;
  }
  select {
    margin: 10px 0;
  }
  .button-theme {
    margin: 10px 10px 0 0;
    .button-github {
      height: 23px;
      img {
        height: 23px;
      }
    }
  }
}
.user-logged {
  font-size: 12px;
  margin-right: 5px;
  margin-top: 10px;
  &.user-logged-dark {
    color: #fff;
  }
}
select {
  height: 20px;
  outline: none;
  border: 1px solid #e0e2e4;
  border-radius: 4px;
  background: #fff;
  margin-bottom: 20px;
}
.button-theme {
  float: right;
  display: flex;
  align-items: center;
  .button-light {
    background: #fff;
    border: 1px solid #46484e;
    color: #46484e;
  }
  .button-dark {
    background: #1c1d21;
    border: 1px solid #1c1d21;
  }
  button {
    color: #fff;
    outline: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 6px 12px;
    margin-left: 10px;
    border: none;
    font-size: 14px;
    transition: 0.3s;
    vertical-align: middle;
    &.button-github {
      height: 30px;
      background: none;
      padding: 0;
      margin-left: 20px;
      img {
        height: 30px;
      }
    }
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.6;
    }
    @media only screen and (max-width: 768px) {
      padding: 3px 6px;
      font-size: 13px;
    }
  }
}
.version-container {
  padding-top: 20px;
  text-align: right;
  font-size: 14px;
  color: grey;
}
</style>
