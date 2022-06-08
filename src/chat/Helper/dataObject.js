export const messages = [
  {
    _id: 7890,
    indexId: 12092,
    content: "Message 1",
    senderId: 12394,
    username: "Ahmad",
    avatar: require("@/assets/images/avatars/avatarYoda.jpeg"),
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
    reactions: {
      "😁": [
        1234, // USER_ID
        4321,
      ],
      "🥰": [1234],
    },
    replyMessage: {
      content: "Reply charta ye",
      senderId: 4321,
    },
  },
];
export const rooms = [
  {
    roomId: 2,
    roomName: "University friends",
    avatar: require("@/assets/images/logo.png"),
    unreadCount: 4,
    index: 3,
    lastMessage: {
      content: "match la zu ",
      senderId: 12394,
      username: "Ahmad",
      timestamp: "10:20",
      saved: true,
      distributed: false,
      seen: false,
      new: true,
    },
    users: [
      {
        _id: "6R0MijpK6M4AIrwaaCY23",
        username: "Imran",
        avatar: require("@/assets/images/avatars/avatar.jpeg"),
        status: { state: "offline", lastChanged: "today, 14:30" },
      },

      {
        _id: 12394,
        username: "Ahmad",
        avatar: require("@/assets/images/avatars/avatarYoda.jpeg"),
        status: { state: "offline", lastChanged: "today, 14:30" },
      },
    ],
    typingUsers: [],
  },
];
// currentUser: {
//     _id: "6R0MijpK6M4AIrwaaCY23",
//     username: "Imran",
//     avatar: require("@/assets/images/avatars/avatar.jpeg"),
//     status: { state: "offline", lastChanged: "today, 14:30" },
//   },
