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
    <v-card style="nav-header">
      <div class="button-chat">
        <input
          type="button"
          @click="displayUsers()"
          class="checck"
          value="hightCheck"
        />
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
    <br />
    <!-- :height="screenHeight" -->

    <chat-window
      :height="screenHeight"
      :styles="styles"
      :theme="theme ? 'light' : 'dark'"
      :current-user-id="currentUser.uid"
      :rooms="getRooms"
      :room-id="getRoomId"
      :room-action="roomActions"
      :rooms-loaded="roomsLoaded"
      :loading-rooms="getLoadingRoomsInitial"
      :messages="getMessages"
      :messages-loaded="getMessagesLoaded"
      :message-selection-actions="messageSelectionActions"
      :menu-actions="menuActions"
      @add-room="addRoom"
      @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      @delete-message="deleteMessage"
    >
    </chat-window>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ChatWindow from "vue-advanced-chat";
import { imran, uniqueId } from "./Helper/helperFunction";
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
      // messages: messages,
      // rooms: rooms,
      previousLastLoadedMessage: null,
      messagesLoadedForSpecific: null,
      roomsLoaded: true,
      messagesLoaded: false,
      loadingRooms: true,
      unreadMessageCountPresent: false,
      addNewRoom: null,
      isChatRecivingUserIsOnline: false,
      lastLoadedMessage: true,
      loadedRooms: true,
      inviteRoomId: null,
      // conversationTabSelected: null,
      removeRoomId: null,
      addRoomUsername: "",
      roomActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Rooms" },
      ],
      menuActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" },
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
      return this.isDevice
        ? window.innerHeight - 40 + "px"
        : "calc(100vh - 80px)";
    },
  },

  methods: {
    ...mapActions("conversation", ["getConverstionforUserr"]),
    ...mapActions("messages", ["getOldMessagesBetweenUserr", "markAsReadd"]),
    ...mapActions("users", ["displayUserss"]),
    ...mapActions("messages/sendMessage", ["sendMessagee"]),
    ...mapActions("messages/reciveMessage", ["listningforMessagee"]),

    fetchMessages({ room }) {
      console.log("i am fetch message", room);
      this.getOldMessagesBetweenUser(room.roomId);
      this.listningforMessage(room);
      // this.markAsReadd();
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

    setMessageAsNewOrOld(element) {
      if (
        element.lastMessage.receiverId == this.currentUser.uid ||
        element.lastMessage.sender.uid == this.currentUser.uid
      )
        return false;
      if (element.lastMessage.readAt) false;
      return true;
    },
    setNewMessageCountInState(element) {
      if (element.unreadMessageCount > 0) {
        this.unreadMessageCountPresent = true;
        console.log(
          "unread message is present in certain room =>",
          this.unreadMessageCountPresent
        );
        return element.unreadMessageCount;
      }
      return element.unreadMessageCount;
    },
    // --------------------------------------   ********************   ---------------------------------------------

    // --------------------------------------   Get  Messages User   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------
    async getOldMessagesBetweenUser(roomId) {
      this.getOldMessagesBetweenUserr(roomId);
    },
    //      ---------------------------------    **************   -----------------------------------------------------

    // --------------------------------------   Send Message Functons   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------

    async sendMessage({ content, roomId }) {
      this.sendMessagee({ content, roomId });
    },

    // --------------------------------------    **************   ---------------------------------------------

    // --------------------------------------   Recive Message Functons   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------

    listningforMessage(room) {
      this.listningforMessagee(room);
    },
    markMessageAsDeliverd(message) {
      var messageId = message.id;
      var receiverId = this.currentUser.uid;
      var receiverType = "user";
      var senderId = this.currentUser.uid;
      CometChat.markAsDelivered(messageId, receiverId, receiverType, senderId);
      console.log("message mark as deliverd");
    },
    deleteMessage({ message, roomId }) {
      // const newArr = this.messages.filter(function (stateMessage) {
      //   return stateMessage._id !== message._id;
      // });
      this.messages.forEach((element) => {
        if (element._id == message._id) {
          element.content = "this message has been deleted";
        }
      });
      // this.messages.filter();
      console.log(roomId);
    },

    // --------------------------------------    **************   ---------------------------------------------

    // --------------------------------------   Room CRUD Functons   ---------------------------------------------
    //      ---------------------------------    **************   ---------------------------------------------

    updateRoomLastMessage() {
      // done
    },
    fetchMoreRooms() {
      console.log("fetchMoreRooms");
    },
    addRoom() {
      this.resetForms();
      this.addNewRoom = true;
    },
    // updateRoomsArray(roomElement) {
    //   let currentRooms = this.rooms;
    //   const roomsToMange = [roomElement, ...currentRooms];
    //   this.rooms = roomsToMange;
    // },
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

    // --------------------------------------    **************   ---------------------------------------------

    // --------------------------------------   utility  Functons   ---------------------------------------------
    //         ------------------------------   Conversation   ------------------------------------------

    // --------------------------------------    **************   ---------------------------------------------

    //         ------------------------------   Send Message   ------------------------------------------
    // --------------------------------------    **************   ---------------------------------------------
    setMessageStateToDeliverd(element) {
      if (element.lastMessage.deliveredAt) return true;
      return false;
    },
    setMessageStateToSeen(element) {
      if (
        element.lastMessage.readAt &&
        element.lastMessage.receiverId !== this.currentUser.uid
      )
        return true;
      return false;
    },
    markAsRead() {
      this.markAsReadd();
      console.log("no meessage to read");
    },
    //         ------------------------------   Recive Message   ------------------------------------------
    // --------------------------------------    **************   ---------------------------------------------
    //         ------------------------------   Genral Message   ------------------------------------------

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
    uniqueId,
    imran,
    // check() {
    //   console.log("ssss");
    //   document.title = "new title";
    //   // console.log(
    //   //   this.isDevice ? window.innerHeight + "px" : "calc(100vh - 80px)"
    //   // );
    // },

    // --------------------------------------    **************   ---------------------------------------------

    playMessageSound() {
      var audio = new Audio(this.audio);
      audio.play();
    },
    // -------------- ENd OF Methods object---------------
  },
  // created() {
  //   this.listningforMessage();
  // },
};
</script>

<style lang="scss" scoped>
@import "./Helper/chatContainer.scss";
</style>
