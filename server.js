const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/ChatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "./client/build")));
  console.log(__dirname1);
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, ".", "client", "build", "index.html"))
  );
} else {
  // app.get("/", (req, res) => {
  //   res.send("API is running..");
  // });
}

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.id); //making the socket connection
  socket.on("setup", (userData) => {
    socket.join(userData._id); //creating new room of user for its notifications handling
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined ChatRoom: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.on("calling", (user, roomId, userId) => {
    console.log("calling", roomId, userId);
    socket.to(userId).emit("incoming call", user, roomId);
  });
  socket.on("join room", (roomID) => {
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });

  socket.on("user-disconnected", (otherPerson) => {
    socket.to(otherPerson._id).emit("user-disconnected");
  });

  //2
  // socket.on("callUser", ({ userToCall, signalData, from, name }) => {
  //   console.log(userToCall);
  //   // socket.to(userToCall).emit("hi");
  //   io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  // });

  // socket.on("answerCall", (data) => {
  //   io.to(data.to).emit("callAccepted", data.signal);
  // });

  //3

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
