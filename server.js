const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);


io.on("connection", (socket) => {

    console.log("New client connected");

    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function (room) {

        console.log("TESTING", room)
        socket.join(room);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});



server.listen(port, () => console.log(`Listening on port ${port}`));