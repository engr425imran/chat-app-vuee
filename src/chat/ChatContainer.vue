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
      @send-message="sendMessage"
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
// import ChatWindow from "@/chat/lib/ChatWindow.vue";
import ChatWindow from "vue-advanced-chat";

import "vue-advanced-chat/dist/vue-advanced-chat.css";
// import "./vue-advanced-chat.css";
// import { parseTimestamp } from "./utils/dates";
export default {
  name: "Test-App",
  components: {
    ChatWindow,
  },
  props: {
    currentUserId: { type: String, required: true },
    theme: { type: String, required: true },
    isDevice: { type: Boolean, required: true },
  },
  data() {
    return {
      roomId: 1,
      styles: { container: { borderRadius: "4px" } },
      roomsPerPage: 15,
      rooms: [
        {
          roomId: 1,
          roomName: "University friends",
          avatar: require("@/assets/images/logo.png"),
          unreadCount: 4,
          index: 3,
          lastMessage: {
            content: "match la zu ",
            senderId: 4321,
            username: "John Snow",
            timestamp: "10:20",
            saved: true,
            distributed: false,
            seen: false,
            new: true,
          },
          users: [
            {
              _id: 12394,
              username: "Luke",
              avatar: require("@/assets/images/avatars/avatarYoda.jpeg"),
              status: { state: "offline", lastChanged: "today, 14:30" },
            },
            {
              _id: 4321,
              username: "John Snow",
              avatar: require("@/assets/images/avatars/avatarYoda.jpeg"),
              status: { state: "online", lastChanged: "14 July, 20:00" },
            },
          ],
          typingUsers: [],
        },
        {
          roomId: 3,
          roomName: "lamghani",
          avatar: require("@/assets/images/avatars/avatarYoda.jpeg"),
          // avatar: require("@/assets/images/peple.png"),
          unreadCount: 1,
          index: 1,
          lastMessage: {
            content: "charta ye",
            senderId: 4321,
            username: "Leia Snow",
            timestamp: "10:20",
            saved: true,
            distributed: false,
            seen: false,
            new: true,
          },
          users: [
            {
              _id: 288,
              username: "Luke",
              avatar: require("@/assets/images/avatars/avatarLuke.jpeg"),
              status: { state: "offline", lastChanged: "today, 14:30" },
            },
            {
              _id: 136,
              username: "Leia Snow",
              avatar: require("@/assets/images/avatars/avatarLeia.jpeg"),
              status: { state: "online", lastChanged: "14 July, 20:00" },
            },
          ],
          typingUsers: [],
        },
      ],
      roomsLoaded: true,
      messagesLoaded: false,
      loadingRooms: false,
      messages: [],
      addNewRoom: null,
      loadedRooms: true,
      inviteRoomId: null,
      removeRoomId: null,
      addRoomUsername: "",
      roomActions: [
        { name: "inviteUser", title: "Invite Users" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" },
      ],
      menuActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Rooms" },
      ],
      messageSelectionActions: [{ name: "deleteMessages", title: "Delete" }],
      roomMessage: "sass",
      templatesText: [
        {
          tag: "help",
          text: "This is the help",
        },
        {
          tag: "action",
          text: "This is the action",
        },
        {
          tag: "action 2",
          text: "This is the second action",
        },
      ],
    };
  },
  computed: {
    screenHeight() {
      return this.isDevice ? window.innerHeight + "px" : "calc(100vh - 80px)";
    },
  },
  created() {},
  methods: {
    openFile() {
      console.log("helo");
    },
    addRoom() {
      this.resetForms();
      this.addNewRoom = true;
    },
    async createRoom() {
      this.disableForm = true;
      // const { id } = await firestoreService.addUser({
      //   username: this.addRoomUsername,
      // });
      // await firestoreService.updateUser(id, { _id: id });
      // await firestoreService.addRoom({
      //   users: [id, this.currentUserId],
      //   lastUpdated: new Date(),
      // });
      this.addNewRoom = false;
      this.addRoomUsername = "";
      this.fetchRooms();
    },
    resetForms() {
      this.disableForm = false;
      this.addNewRoom = null;
      this.addRoomUsername = "";
      this.inviteRoomId = null;
      this.invitedUsername = "";
      this.removeRoomId = null;
      this.removeUserId = "";
    },
    async deleteMessage({ message, roomId }) {
      // await firestoreService.updateMessage(roomId, message._id, {
      //   deleted: new Date(),
      // });
      const { files } = message;
      if (files) {
        console.log(files, message, roomId);
        // files.forEach((file) => {
        //   storageService.deleteFile(this.currentUserId, message._id, file);
        // });
      }
    },

    fetchMessages({ room, options = {} }) {
      this.$emit("show-demo-options", false);
      if (options.reset) {
        this.resetMessages();
        this.roomId = room.roomId;
      }
      if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
        this.messagesLoaded = true;
        return;
      }
      this.selectedRoom = room.roomId;
      console.log(room, options);
    },
    sendMessage() {
      console.log("olamba");
    },
    fetchRooms() {
      this.resetRooms();
      this.fetchMoreRooms();
    },
    resetRooms() {
      console.log("ddd");
    },
    fetchMoreRooms() {
      console.log("fetchMoreRooms");
    },
    resetMessages() {
      console.log("resetMessages");
    },
  },
};
</script>

<style lang="scss" scoped>
.window-container {
  width: 100%;
}
.window-mobile {
  form {
    padding: 0 10px 10px;
  }
}
form {
  padding-bottom: 20px;
}
input {
  padding: 5px;
  width: 140px;
  height: 21px;
  border-radius: 4px;
  border: 1px solid #d2d6da;
  outline: none;
  font-size: 14px;
  vertical-align: middle;
  &::placeholder {
    color: #9ca6af;
  }
}
button {
  background: #202f27;
  color: #fff;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px 12px;
  margin-left: 10px;
  border: none;
  font-size: 14px;
  transition: 0.3s;
  vertical-align: middle;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
  &:disabled {
    cursor: initial;
    background: #c6c9cc;
    opacity: 0.6;
  }
}
.button-cancel {
  color: #a8aeb3;
  background: none;
  margin-left: 5px;
}
select {
  vertical-align: middle;
  height: 33px;
  width: 152px;
  font-size: 13px;
  margin: 0 !important;
}
</style>
