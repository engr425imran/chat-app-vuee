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
          {{ user }}
        </option>
      </select>
      <button type="submit" :disabled="disableForm || !removeUserId">
        Remove User
      </button>
      <button class="button-cancel" @click="removeRoomId = null">Cancel</button>
    </form>
    <v-card elevation="3" style="nav-header">
      <div class="button-chat">
        <input
          type="button"
          @click="displayUsers()"
          :class="{ isActive: getConversationTabSelected === false }"
          class="checck"
          value="users"
        />
        <input
          type="button"
          style="margin-left: 20px"
          @click="getConverstionforUser()"
          class="checck"
          :class="{ isActive: getConversationTabSelected === true }"
          value="converstion"
        />
      </div>
    </v-card>
    <!-- :height="screenHeight" -->

    <chat-window
      :height="screenHeight"
      :styles="styles"
      :theme="theme ? 'light' : 'dark'"
      :current-user-id="currentUser.uid"
      :rooms="getRooms"
      :room-action="roomActions"
      :rooms-loaded="roomsLoaded"
      :loading-rooms="getLoadingRoomsInitial"
      :messages="getMessages"
      :messages-loaded="getMessagesLoaded"
      :message-selection-actions="messageSelectionActions"
      :menu-actions="menuActions"
      :message-actions="messageActions"
      :text-formatting="textFormatting"
      @add-room="addRoom"
      @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      @delete-message="deleteMessage"
      @typing-message="typingMessage"
    >
      <!-- <template #room-header="{ room, userStatus }">
        {{ room.roomName }} - {{ userStatus }}
      </template> -->
    </chat-window>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
import { CometChat } from "@cometchat-pro/chat";
// import axios from "axios";

export default {
  name: "Chat-Container",
  components: {
    ChatWindow,
  },
  props: {
    theme: { type: Boolean, default: true },
    isDevice: { type: Boolean, required: true },
    currentUser: { type: Object, required: true },
  },
  data() {
    return {
      roomId: null,
      audio: require("@/assets/audio/notifi.wav"),
      messages: [],
      styles: { container: { borderRadius: "4px" } },

      textFormatting: {
        disabled: false,
        italic: "_",
        bold: "*",
        strike: "~",
        underline: "°",
        multilineCode: "```",
        inlineCode: "``",
      },
      previousLastLoadedMessage: null,
      messagesLoadedForSpecific: null,
      roomsLoaded: true,
      addNewRoom: null,
      isChatRecivingUserIsOnline: false,
      lastLoadedMessage: true,
      loadedRooms: true,
      removeRoomId: null,
      inviteRoomId: null,
      addRoomUsername: "",
      messageActions: [
        {
          name: "editMessage",
          title: "Edit Message",
          onlyMe: true,
        },
        {
          name: "deleteMessage",
          title: "Delete Message",
          onlyMe: true,
        },
        {
          name: "selectMessages",
          title: "Select",
        },
      ],
      roomActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Rooms" },
      ],
      menuActions: [
        { name: "inviteUser", title: "Check Function" },
        // { name: "removeUser", title: "Remove User" },
        // { name: "deleteRoom", title: "Delete Room" },
      ],
      messageSelectionActions: [{ name: "deleteMessages", title: "Delete" }],
      roomMessage: "",
    };
  },
  computed: {
    ...mapGetters("conversation", [
      "getRooms",
      "getUnreadMessageIsPresent",
      "getConversationTabSelected",
      "getLoadingRoomsInitial",
      "getRoomId",
      "getMessagesLoaded",
    ]),
    ...mapGetters("messages", ["getMessages"]),
    screenHeight() {
      return "calc(85vh - 70px)";
    },
  },

  methods: {
    ...mapActions("conversation", ["getConverstionforUserr"]),
    ...mapActions("messages", ["getOldMessagesBetweenUserr", "markAsReadd"]),
    ...mapActions("messages/sendMessage/mediaMessage", [
      "sendAudioToBackend",
      "sendImageToBackendd",
      "sendImageToBackend",
      "sendMultipleMeid",
    ]),
    ...mapActions("users", ["displayUserss"]),
    ...mapActions("messages/sendMessage", [
      "sendTextMessage",
      "sendMediaMessage",
    ]),
    ...mapActions("messages/receiveMessage", ["listningforMessagee"]),
    ...mapActions("messages/deleteMessage", ["delete"]),
    heightCheck() {
      console.log(window.innerHeight);
    },
    fetchMessages({ room }) {
      console.log("i am fetch message", room);
      this.getOldMessagesBetweenUser(room.roomId);
      this.listningforMessage(room);
    },
    // --------------------------------------   Get Conversation For User   ---------------------------------------------
    //      ---------------------------------    ++++ display Users  ++++   ---------------------------------------------
    displayUsers() {
      this.displayUserss();
    },
    //      ---------------------------------   ||| *** Users ||| ***   -----------------------------------------------------

    getConverstionforUser() {
      this.getConverstionforUserr();
    },
    //      ---------------------------------    **************   -----------------------------------------------------
    // --------------------------------------   Get  Messages User   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------
    async getOldMessagesBetweenUser(roomId) {
      this.getOldMessagesBetweenUserr(roomId);
    },
    //      ---------------------------------    **************   -----------------------------------------------------

    // --------------------------------------   Send Message Functons   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------

    async sendMessage({ content, roomId, files }) {
      if (files) {
        const arrageFiles = this.formattedFiles(files);
        let payload = {
          receiverID: roomId,
          arrageFiles,
        };
        if (files[0].audio === true) {
          payload.arrageFiles[0].audio = true;
          payload.arrageFiles[0].extension = "mp3";
          payload.arrageFiles[0].duration = files[0].duration;
          this.sendAudioToBackend(payload);
          return;
        }

        this.sendImageToBackend(payload);
        return;
      }
      this.sendTextMessage({ content, roomId });
    },

    formattedFiles(files) {
      const formattedFiles = [];
      files.forEach((file) => {
        let messageFile = new Object();
        messageFile.name = file.name;
        messageFile.size = file.size;
        messageFile.mimeType = file.type;
        messageFile.extension = file.extension;
        messageFile.source = file.blob;
        formattedFiles.push(messageFile);
      });
      return formattedFiles;
    },
    // --------------------------------------    **************   ---------------------------------------------

    // --------------------------------------   Recive Message Functons   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------

    listningforMessage(room) {
      this.listningforMessagee(room);
    },
    deleteMessage({ message, roomId }) {
      let payload = {
        messageId: message._id,
        message: message,
        roomId,
      };
      // console.log(payload, message);
      this.delete(payload);
    },

    typingMessage({ roomId }) {
      // console.log(message);
      let receiverId = roomId;
      let receiverType = CometChat.RECEIVER_TYPE.USER;

      let typingNotification = new CometChat.TypingIndicator(
        receiverId,
        receiverType
      );
      CometChat.startTyping(typingNotification);
    },

    // --------------------------------------    **************   ---------------------------------------------

    // --------------------------------------   Room CRUD Functons   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------

    fetchMoreRooms() {
      console.log("fetchMoreRooms");
    },
    addRoom() {
      this.resetForms();
      this.addNewRoom = true;
    },
    async createRoom(form) {
      this.disableForm = true;
      // const { id } = await firestoreService.addUser({
      //   username: this.addRoomUsername,
      // });
      // await firestoreService.updateUser(id, { _id: id });
      // await firestoreService.addRoom({
      //   users: [id, this.currentUserId],
      //   lastUpdated: new Date(),
      // });
      const newRoom = {
        roomId: this.uniqueId(),
        roomName: form.target[0]._value,
        avatar: require("@/assets/images/users.svg"),
        users: [],
      };
      // console.log(form.target[0]._value);
      this.addNewRoom = false;
      this.addRoomUsername = "";
      this.rooms.push(newRoom);
      // this.fetchRooms();
    },

    fetchRooms() {
      this.resetRooms();
      this.fetchMoreRooms();
    },

    markAsRead() {
      this.markAsReadd();
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
    resetMessages() {
      this.messages = [];
      this.messagesLoaded = false;
      this.lastLoadedMessage = null;
      this.previousLastLoadedMessage = null;
      this.listeners.forEach((listener) => listener());
      this.listeners = [];
    },
    resetRooms() {
      console.log("ddd");
    },

    // --------------------------------------    **************   ---------------------------------------------

    // -------------- ENd OF Methods object---------------
  },
  created() {
    this.listningforMessage();
  },
};
</script>

<style lang="scss" scoped>
@import "./Helper/chatContainer.scss";
</style>
