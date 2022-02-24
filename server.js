const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
// Set view engine (Front-End)
app.set("view engine", "ejs");

// set public path
app.use(express.static("public"));

// add peer server
app.use('/peerjs', peerServer);

// routes
app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
  // res.status(200).send("Hello World")
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("joined room");
    socket.join(roomId);
    socket.to(roomId).emit("user-connected",userId);
    socket.on('message',(message) => {
        io.to(roomId).emit('createMessage',message,userId)
    })
  });
});

// start server, listen on port 3030
server.listen(3030);
