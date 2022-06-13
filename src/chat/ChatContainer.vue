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
    <!-- <Button @click="checkObj()" class="check">display message</Button> -->
    <!-- <Button @click="checkingSplice()" class="check">splice</Button> -->
    <Button @click="displayUsers()" class="check">users</Button>
    <Button @click="getConverstionforUser()" class="check">converstion</Button>
    <chat-window
      :rooms="rooms"
      :room-id="roomId"
      :height="screenHeight"
      :styles="styles"
      :room-action="roomActions"
      :menu-actions="menuActions"
      :rooms-loaded="roomsLoaded"
      :current-user-id="currentUser.uid"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      :message-selection-actions="messageSelectionActions"
      @fetch-more-rooms="fetchMoreRooms"
      @add-room="addRoom"
      @send-message="sendMessage"
      @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
      @delete-message="deleteMessage"
      @fetch-messages="fetchMessages"
    >
    </chat-window>
    <!-- 
      :loading-rooms="loadingRooms"
     -->
    <!-- functions to be uses -->
    <!-- @fetch-messages="fetchMessages" -->

    <!-- <div>
      :room-actions="roomActions"

      @edit-message="editMessage"
      @open-user-tag="openUserTag"
      @room-action-handler="menuActionHandler"
      @menu-action-handler="menuActionHandler"
      @message-selection-action-handler="messageSelectionActionHandler"
      @typing-message="typingMessage"
    </div> -->
  </div>
</template>

<script>
import ChatWindow from "vue-advanced-chat";
import { imran, uniqueId } from "./Helper/helperFunction";
// import { rooms } from "./Helper/dataObject";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
import { CometChat } from "@cometchat-pro/chat";
// import { rooms } from "./Helper/dataObject";
// import { messages } from "./Helper/dataObject";

export default {
  name: "Chat-Container",
  components: {
    ChatWindow,
  },
  props: {
    theme: { type: String, default: "light" },
    isDevice: { type: Boolean, required: true },
    currentUser: { type: Object, required: true },
  },
  data() {
    return {
      roomId: null,
      messages: [],
      rooms: [],
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
    screenHeight() {
      return this.isDevice ? window.innerHeight + "px" : "calc(100vh - 80px)";
    },
  },

  methods: {
    openFile() {
      console.log("helo");
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
    resetForms() {
      this.disableForm = false;
      this.addNewRoom = null;
      this.addRoomUsername = "";
      this.inviteRoomId = null;
      this.invitedUsername = "";
      this.removeRoomId = null;
      this.removeUserId = "";
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

    // fetchMessages({ room, options = {} }) {
    fetchMessages({ room }) {
      this.getOldMessagesBetweenUser(room.roomId);
      this.listningforMessage(room);
      // this.markAsRead(room);
      // if (this.previousLastLoadedMessage) {
      //   this.messagesLoaded = true;
      //   console.log("waiiii");
      //   return;
      // }

      // this.selectedRoom = room.roomId;
      // this.roomId = room.roomId;
      // // this.messagesLoaded = true;
      // console.log("imran khan", room, options);
      // // console.log("options", options);
    },
    onMessage() {
      const message = {
        _id: this.uniqueId(),
        indexId: this.uniqueId(),
        senderId: 12394,
        content: "alaka pira wrak ye",
        timestamp: new Date(),
        username: "Ahmad",
        avatar: require("@/assets/images/avatars/avatarYoda.jpeg"),
      };
      this.messages.push(message);
    },
    async sendMessage({ content, roomId }) {
      var rooms = this.rooms;
      const room = rooms.find((ele) => ele.roomId == roomId);
      // console.log(room);
      // console.log(this.rooms);
      let receiverID = roomId;
      let messageText = content;
      let receiverType = CometChat.RECEIVER_TYPE.USER;
      let textMessage = new CometChat.TextMessage(
        receiverID,
        messageText,
        receiverType
      );
      CometChat.sendMessage(textMessage).then(
        (message) => {
          // console.log("Message sent successfully:", message);
          const messagePushToState = {
            _id: message.id,
            indexId: message.id,
            senderId: this.currentUser.uid,
            content: content,
            username: this.currentUser.username,
            avatar: this.currentUser.avatar,
            timestamp: this.formatTime(message.sentAt),
            date: this.formatDate(message.sentAt),
            saved: true,
            distributed: room.status === "online" ? true : false,
            seen: false,
          };
          this.messages.push(messagePushToState);
          // this.markMessageAsDeliverd(message);
        },
        (error) => {
          console.log("Message sending failed with error:", error);
        }
      );
    },
    markMessageAsDeliverd(message) {
      var messageId = message.id;
      var receiverId = this.currentUser.uid;
      var receiverType = "user";
      var senderId = this.currentUser.uid;
      CometChat.markAsDelivered(messageId, receiverId, receiverType, senderId);
      console.log("message mark as deliverd");
    },
    resetMessages() {
      this.messages = [];
      this.messagesLoaded = false;
      this.lastLoadedMessage = null;
      this.previousLastLoadedMessage = null;
      this.listeners.forEach((listener) => listener());
      this.listeners = [];
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
    displayUsers() {
      const users = new CometChat.UsersRequestBuilder().setLimit(5);
      const usersRequest = users.build();
      usersRequest.fetchNext().then((usersList) => {
        var newRooms = [];
        var roomObject;
        console.log(usersList);
        usersList.forEach((element) => {
          roomObject = {};
          roomObject["roomId"] = element.uid;
          roomObject["roomName"] = element.name;
          roomObject["avatar"] = element.avatar;
          roomObject["uid"] = element.uid;
          roomObject["users"] = [];
          newRooms.push(roomObject);
        });
        this.rooms = newRooms;
        this.roomId = this.rooms[0].roomId;
        this.messagesLoaded = true;
        this.roomsLoaded = true;
      });
    },
    listningforMessage(room) {
      let listenerID = "UNIQUE_LISTENER_ID";
      CometChat.addMessageListener(
        listenerID,
        new CometChat.MessageListener({
          onTextMessageReceived: (textMessage) => {
            if (room.roomId !== textMessage.sender.uid) return;
            const message = {
              _id: textMessage.rawMessage.id,
              indexId: textMessage.rawMessage.id,
              senderId: textMessage.sender.uid,
              username: textMessage.sender.name,
              avatar: textMessage.sender.avatar,
              content: textMessage.data.text,
              timestamp: this.formatTime(textMessage.sentAt),
              date: this.formatDate(textMessage.sentAt),
              saved: true,
              distributed: true,
              new: true,
            };
            this.messages.push(message);
            this.updateRoomLastMessage(room.roomId, message);
            this.markAsRead(textMessage);
            // addReciveMessages(textMessage);
          },
        })
      );
    },
    updateRoomLastMessage(roomId, meessage) {
      let currentRooms = this.rooms;
      currentRooms.forEach((element, index) => {
        console.log(element.roomId, roomId);
        if (element.roomId == roomId) {
          currentRooms[index].lastMessage = meessage;
          const addRoomElement = currentRooms[index];
          if (index == 0) {
            this.rooms = currentRooms;
            return;
          }
          this.updateRoomsArray(addRoomElement);
          return;
        }
      });
    },
    updateRoomsArray(roomElement) {
      let currentRooms = this.rooms;
      currentRooms.splice(0, 1);
      currentRooms.splice(0, 0, roomElement);
      this.rooms = currentRooms;
    },
    markAsRead(textMessage) {
      if (textMessage.rawMessage) {
        var messageId = textMessage.rawMessage.id;
        var receiverId = textMessage.sender.uid;
        var receiverType = "user";
        var senderId = textMessage.sender.uid;
        CometChat.markAsRead(messageId, receiverId, receiverType, senderId);
        const currentRoomsInState = this.rooms;
        const newArrayRooms = currentRoomsInState.map(function (room) {
          if (room.roomId === textMessage.sender.uid) {
            console.log(room.roomId);
            room.unreadCount = 0;
          }
          return room;
        });
        this.rooms = newArrayRooms;
        console.log("message marked as read || the user was on chat window");
        return;
      }
      if (this.unreadMessageCountPresent) {
        const message = this.messages[this.messages.length - 1];
        console.log(message);
        CometChat.markAsRead(
          message._id,
          message.senderId,
          "user",
          message.senderId
        ).then(
          () => {
            console.log("mark as read success.");
          },
          (error) => {
            console.log(
              "An error occurred when marking the message as read.",
              error
            );
          }
        );
        const currentRoomsInState = this.rooms;
        const newArrayRooms = currentRoomsInState.map(function (room) {
          if (room.roomId === message.senderId) {
            console.log(room.roomId);
            room.unreadCount = 0;
          }
          return room;
        });
        this.rooms = newArrayRooms;
        console.log(" marked as read || the user has just open chat window");
        return;
      }
      console.log("no meessage to read");
    },
    uniqueId,
    listenMessages(room) {
      console.log("listning to message", room);
    },
    async getOldMessagesBetweenUser(roomId) {
      let UID = roomId;
      let limit = 2;
      let messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(UID)
        .setLimit(limit)
        .build();

      messagesRequest.fetchPrevious().then(
        (messages) => {
          this.addOldMessagesToSateToMessagesArray(messages, roomId);
        },
        (error) => {
          console.log("Message fetching failed with error:", error);
        }
      );
    },
    addOldMessagesToSateToMessagesArray(messages, roomId) {
      var oldConverstion = [];
      // console.log(messages);
      messages.forEach((element, index) => {
        var messageObject = {};
        messageObject["_id"] = element.id;
        messageObject["indexId"] = index + 1;
        messageObject["content"] = element.text;
        messageObject["senderId"] = element.sender.uid;
        messageObject["timestamp"] = this.formatTime(element.sentAt);
        messageObject["date"] = this.formatDate(element.sentAt);
        messageObject["saved"] = true;
        messageObject["new"] = true;
        messageObject["distributed"] =
          element.deliveredAt && element.sender.uid === this.currentUser.uid
            ? true
            : false;
        messageObject["seen"] =
          element.sentAt && element.sender.uid === this.currentUser.uid
            ? true
            : false;
        messageObject["avatar"] = element.sender.avatar;
        oldConverstion.push(messageObject);
      });
      this.messages = oldConverstion;
      oldConverstion = [];
      this.markAsRead(roomId);
      this.messagesLoaded = true;
    },
    checking() {
      console.log("ss");
      // console.log(this.messagesLoaded);
      // this.messagesLoaded = !this.messagesLoaded;
      // console.log(this.messagesLoaded);
    },
    imran,
    getConverstionforUser() {
      let limit = 30;
      let conversationsRequest = new CometChat.ConversationsRequestBuilder()
        .setLimit(limit)
        .build();

      conversationsRequest.fetchNext().then(
        (conversationList) => {
          // console.log("Conversations list received:", conversationList);
          this.displayConversation(conversationList);
        },
        (error) => {
          console.log("Conversations list fetching failed with error:", error);
        }
      );
    },
    displayConversation(conversationList) {
      var newRooms = [];
      var roomObject;
      // console.log(conversationList);
      conversationList.forEach((element) => {
        if (element.conversationType === "group") {
          roomObject = {
            roomId: element.conversationWith.guid,
            roomName: element.conversationWith.name,
            avatar: element.conversationWith.icon,
            unreadCount: element.unreadMessageCount,
            users: [],
            lastMessage: {
              content: element.lastMessage ? element.lastMessage.text : "",
              senderId: element.lastMessage ? element.lastMessage.sender : "",
              username: element.lastMessage ? element.lastMessage.name : "",
              timestamp: "Set me",
              date: "set me",
              saved: true,
              distributed: false,
              seen: true,
              new: false,
            },
          };
        } else {
          roomObject = {
            roomId: element.conversationWith.uid,
            roomName: element.conversationWith.name,
            avatar: element.conversationWith.avatar,
            uid: element.conversationWith.uid,
            status: element.conversationWith.status,
            unreadCount: this.setNewMessageCountInState(element),
            // unreadCount: element.unreadMessageCount,
            users: [
              {
                _id: this.currentUser.uid,
                username: this.currentUser.name,
                avatar: this.currentUser.avatar,
                status: {
                  state: this.currentUser.status,
                  lastChanged: "live",
                },
              },
              {
                _id: element.conversationWith.uid,
                username: element.conversationWith.name + "i am cyclose",
                avatar: element.conversationWith.avatar,
                status: {
                  state: element.conversationWith.status,
                  lastChanged: this.formatTime(
                    element.conversationWith.lastActiveAt
                  ),
                },
              },
            ],
            lastMessage: {
              content: element.lastMessage.text,
              senderId: element.lastMessage.sender.uid,
              username: element.lastMessage.sender.name,
              timestamp: this.formatTime(element.lastMessage.sentAt),
              date: "today, 10:45",
              saved: true,
              distributed: this.setMessageStateToDeliverd(element),
              seen: this.setMessageStateToSeen(element),
              new: this.setMessageAsNewOrOld(element),
            },
          };
        }

        newRooms.push(roomObject);
      });
      this.previousLastLoadedMessage = true;
      this.rooms = newRooms;
      // console.log(newRooms);
      this.roomId = this.rooms[0].roomId;
      this.messagesLoaded = true;
      this.roomsLoaded = true;
    },
    checkObj() {
      var message = {
        _id: "textMessage.rawMessage.id",
        indexId: this.uniqueId(),
        senderId: "superhero5",
        username: "Cyclops",
        avatar:
          "https://data-us.cometchat.io/assets/images/avatars/cyclops.png",
        content: "charta ye pira",
        timestamp: "9:00 am",
        date: "13 jun ",
        saved: true,
        distributed: true,
      };
      var currentRooms = this.rooms;
      currentRooms[1].lastMessage = message;
      const roomToMove = currentRooms[1];
      currentRooms.splice(1, 1);
      currentRooms.splice(0, 0, roomToMove);
      this.rooms = currentRooms;
      this.roomId = roomToMove.roomId;
      // this.formatRoomsAfterNewMessage(currentRooms, 1, 0);
    },
    formatRoomsAfterNewMessage(arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      console.log("before removing item => ", arr);
      arr.splice(fromIndex, 1);
      console.log("after removing item => ", arr);
      arr.splice(toIndex, 0, element);
      console.log("after adding element item => ", arr);
      this.rooms = arr;
    },
    formatTime(utcTime) {
      const time = new Date(utcTime * 1000).toLocaleString("en-us", {
        hour: "numeric",
        minute: "numeric",
      });
      return time;
    },
    formatDate(utcTime) {
      const dd = new Date(utcTime * 1000).toLocaleString("en-us", {
        day: "numeric",
        month: "long",
      });
      const formatime = dd.split(" ").reverse().join(" ");
      return formatime;
    },
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
    setNewMessageCountInState(element) {
      if (element.unreadMessageCount > 0) {
        this.unreadMessageCountPresent = true;
        return element.unreadCount;
      }
      return element.unreadCount;
    },
    setMessageAsNewOrOld(element) {
      if (
        element.lastMessage.receiverId == this.currentUser.uid ||
        element.lastMessage.sender.uid == this.currentUser.uid
      )
        return false;
      if (element.lastMessage.readAt) false;
      return true;
    },
    checkingSplice() {
      var parray = [1, 2, 3, 4, 5];
      parray.splice(0, 1);
      console.log(parray);
      parray.splice(0, 0, "element");

      console.log(parray);
    },
  },
  created() {
    this.listningforMessage();
  },
  beforeDestroy() {
    // let listenerID = "UNIQUE_LISTENER_ID";
    // CometChat.removeMessageListener(listenerID);
  },
};
</script>

<style lang="scss" scoped>
@import "./Helper/chatContainer.scss";
</style>
