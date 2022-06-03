<template>
  <div class="window-container" :class="{ 'window-mobile': isDevice }">
    <form v-if="addNewRoom" @submit.prevent="createRoom">
      <input v-model="addRoomUsername" type="text" placeholder="Add username" />
      <button type="submit" :disabled="disableForm || !addRoomUsername">
        Create Room
      </button>
      <button class="button-cancel" @click="addNewRoom = false">Cancel</button>
    </form>

    <form v-if="inviteRoomId" @submit.prevent="addRoomUser">
      <input v-model="invitedUsername" type="text" placeholder="Add username" />
      <button type="submit" :disabled="disableForm || !invitedUsername">
        Add User
      </button>
      <button class="button-cancel" @click="inviteRoomId = null">Cancel</button>
    </form>

    <form v-if="removeRoomId" @submit.prevent="deleteRoomUser">
      <select v-model="removeUserId">
        <option default value="">Select User</option>
        <option v-for="user in removeUsers" :key="user._id" :value="user._id">
          {{ user.username }}
        </option>
      </select>
      <button type="submit" :disabled="disableForm || !removeUserId">
        Remove User
      </button>
      <button class="button-cancel" @click="removeRoomId = null">Cancel</button>
    </form>
    <chat-window
      :rooms="rooms"
      :height="screenHeight"
      :theme="theme"
      :styles="styles"
      :current-user-id="currentUserId"
      :room-id="roomId"
      :loading-rooms="loadingRooms"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      :rooms-loaded="roomsLoaded"
      :room-actions="roomActions"
      :menu-actions="menuActions"
      :message-selection-actions="messageSelectionActions"
      :room-message="roomMessage"
      :templates-text="templatesText"
      @fetch-more-rooms="fetchMoreRooms"
      @add-room="addRoom"
      @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
    >
      <!-- <template #emoji-picker="{ emojiOpened, addEmoji }">
        <button
          style="background-color: red"
          @click="addEmoji({ unicode: '😁' })"
        >
          {{ emojiOpened }}
        </button>
      </template> -->
    </chat-window>
    <!-- functions to be uses -->
    <!-- <div>
      @send-message="sendMessage"
      @edit-message="editMessage"
      @delete-message="deleteMessage"
      @open-file="openFile"
      @open-user-tag="openUserTag"
      @room-action-handler="menuActionHandler"
      @menu-action-handler="menuActionHandler"
      @message-selection-action-handler="messageSelectionActionHandler"
      @send-message-reaction="sendMessageReaction"
      @typing-message="typingMessage"
    </div> -->
  </div>
</template>
<script>
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";

import { mapGetters } from "vuex";

export default {
  components: {
    ChatWindow,
  },
  data() {
    return {
      dark: "dark",
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
          avatar: "@/assets/images/avatar.jpeg",
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
