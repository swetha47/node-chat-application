const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("../src/utils/messages");
const {
  addUsers,
  deleteUser,
  getUser,
  getUsersInRoom,
} = require("../src/utils/users");
const { SSL_OP_NO_TICKET } = require("constants");

const port = process.env.PORT;
const publicDirectory = path.join(__dirname, "../public");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.json());
app.use(express.static(publicDirectory));

io.on("connection", (socket) => {
  console.log("connected to the client");

  socket.on("Join", ({ username, room }, callback) => {
    const { error, user } = addUsers({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit("message", generateMessage("Admin", "Welcome!!"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", user.username + " has joined the room!!")
      );

    const usersample = getUsersInRoom(user.room);
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!!");
    }
    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback();
    }
  });

  socket.on("sendLocation", (location, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);
    if (filter.isProfane(location)) {
      return callback("Profanity is not allowed!!");
    }

    if (user) {
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.username,
          "https://google.com/maps?q=" +
            location.latitude +
            "," +
            location.longitude
        )
      );
    }
    callback();
  });

  socket.on("disconnect", () => {
    const user = deleteUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", user.username + " has left the terminal")
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.get("", (req, res) => {
  res.render("index", {
    title: "Chat App",
  });
});

server.listen(port, (req, res) => {
  console.log("Listening to Chat app");
});
