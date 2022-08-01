<template>
  <div class="window-container" :class="{ 'window-mobile': isDevice }">
    <form v-if="getHideAddUserButton" @submit.prevent="createRoom">
      <input
        @keyup="checking"
        v-model="addRoomUsername"
        type="email"
        placeholder="Enter email"
        style="padding: 15px"
      />

      <button type="submit" :disabled="getUserFind">
        <!-- <button type="submit" :disabled="disableForm || !addRoomUsername"> -->
        Add User
      </button>
      <button class="button-cancel" @click="addFriendInCometChat">
        Cancel
      </button>
      <!-- <button class="button-cancel" @click="cancelNewRoom">Cancel</button> -->
    </form>

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
import { mapGetters, mapActions, mapMutations } from "vuex";
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
import { CometChat } from "@cometchat-pro/chat";

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
    ...mapGetters("users", ["getUserFind", "getHideAddUserButton"]),
    screenHeight() {
      return "calc(85vh - 70px)";
    },
  },

  methods: {
    ...mapMutations("users", ["SET_HIDE_ADD_USER_BUTTON"]),
    ...mapActions("conversation", ["getConverstionforUserr"]),
    ...mapActions("messages", ["getOldMessagesBetweenUserr", "markAsReadd"]),
    ...mapActions("messages/sendMessage/mediaMessage", [
      "sendAudioToBackend",
      "sendImageToBackendd",
      "sendImageToBackend",
      "sendMultipleMeid",
    ]),
    ...mapActions("users", [
      "displayUserss",
      "addFriends",
      "searchUserInCometChat",
      "addRoomForUser",
      "addFriendInCometChat",
    ]),
    ...mapActions("messages/sendMessage", [
      "sendTextMessage",
      "sendMediaMessage",
    ]),
    ...mapActions("messages/receiveMessage", ["listningforMessagee"]),
    ...mapActions("listFriends", ["getFriendsForUsers"]),
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
    cancelNewRoom() {
      this.SET_HIDE_ADD_USER_BUTTON(false);
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

    checking(e) {
      const email = e.target.value;
      if (email.length < 12) return;
      const emailValidated = this.validateEmail(email);
      if (emailValidated !== null) {
        this.searchUserInCometChat(emailValidated[0]);
      }
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
      this.SET_HIDE_ADD_USER_BUTTON(true);
      this.resetForms();
    },
    async createRoom() {
      console.log("adding user to room");
      this.addRoomForUser();
    },
    validateEmail(email) {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
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
    this.getFriendsForUsers();
  },
};
</script>

<style lang="scss" scoped>
@import "./Helper/chatContainer.scss";
</style>
