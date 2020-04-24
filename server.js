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

const playerJoin = (socket, room) => {
    socket.join(room.id, () => {
        socket.roomId = room.id
        console.log(`Player ${socket.id} joined  room ${room.id}`)
    });
    room.sockets.push(socket.id)

    socket.emit("joinedRoom", room)

}

const getRoom = (roomId) => {
    const room = roomsList.filter((room, index) => {
        if (room.id == roomId) {
            return true
        }

        return false
    })

    if (room) return room[0]

    return false

}

const updateRoom = (roomId, data) => {

    const room = roomsList.map((room, index) => {
        if (room.id == roomId) {
            return room.game = data
        }

    })

    console.log("UPDATE ROOM", room)

    roomsList = room

}


io.on("connection", (socket) => {

    console.log("client connected");
    io.emit("roomList", roomsList)

    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('createRoom', function (room) {

        const newRoom = {
            id: room,
            name: room,
            sockets: []
        }


        playerJoin(socket, newRoom)
        roomsList.push(newRoom);
        io.emit("roomList", roomsList)
    });

    socket.on("joinRoom", function (room) {

        playerJoin(socket, room)

        let updatedRoom = roomsList.map(value => {
            if (value.id == room.id) {
                return value = room
            }
        })

        roomsList = updatedRoom
        //socket.in(room).emit('message', 'welcome');
    })

    socket.on("ready", function () {
        console.log(socket.id, "is ready")

        let room = getRoom(socket.roomId)

        if (room && room.sockets.length == 2) {
            for (const id of room.sockets) {


                const socket = io.of("/").connected[id];

                //console.log("socket", socket)

                socket.emit("initGame")
            }
        }
    })

    socket.on("startGame", () => {
        console.log(socket.id, "starting game")
        io.sockets.in(socket.roomId).emit('playGame');
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});







server.listen(port, () => console.log(`Listening on port ${port}`));