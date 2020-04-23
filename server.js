const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let roomsList = []


io.on("connection", (socket) => {

    console.log("client connected");
    io.emit("roomList", roomsList)

    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('createRoom', function (room) {
        console.log(room)
        roomsList.push(room)
        socket.join(room);
        io.emit("roomList", roomsList)
    });

    socket.on("joinRoom", function (room) {
        console.log("enter room", room)
        socket.join(room);
        socket.emit("joinedRoom", room)
        //socket.in(room).emit('message', 'welcome');
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});







server.listen(port, () => console.log(`Listening on port ${port}`));