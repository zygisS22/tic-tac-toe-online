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

const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];

const playerJoin = (socket, room) => {
    socket.join(room.id, () => {
        socket.roomId = room.id
        console.log(`Player ${socket.id} with username ${socket.username} joined  room ${room.id}`)
    });
    room.sockets.push([socket.id, socket.username])

    socket.emit("joinedRoom", room)

}

const checkSelections = (array, selections) => {


    let found = []

    console.log("array", selections)
    selections.forEach(element2 => {
        console.log("value", parseInt(element2))
        console.log("FIND INDEX", array.indexOf(parseInt(element2)))

        if (array.indexOf(parseInt(element2)) > -1) {
            found.push(parseInt(element2))
        }
    })

    console.log("FOUND", found)

    if (found.length == 3) return true

    return false



}

const checkWinner = (room) => {

    const board = room.game.board

    let player1Selections = {}
    let player2Selections = {}
    let winner = ""

    Object.values(board).map((value, index) => {
        if (value == room.sockets[0][0]) {
            player1Selections[index] = value
        } else if (value == room.sockets[1][0]) {
            player2Selections[index] = value
        }
    })

    player1Selections = Object.keys(player1Selections)
    player2Selections = Object.keys(player2Selections)

    winConditions.forEach(array => {


        const winPlayer1 = player1Selections.length >= 3 ? checkSelections(array, player1Selections) : false
        const winPlayer2 = player2Selections.length >= 3 ? checkSelections(array, player2Selections) : false

        console.log("winConditions", array)
        console.log("player1", player1Selections)
        console.log("player1 win", winPlayer1)
        console.log("player2", player2Selections)
        console.log("player2 win", winPlayer2)


        if (winPlayer1) {
            winner = room.sockets[0][1]
        } else if (winPlayer2) {
            winner = room.sockets[1][1]
        }
    })

    console.log("winner", winner)

    if (room.game.moves == 8 && !winner) return "draw"

    return winner

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

const updateRoom = (newRoom) => {

    let updatedRoom = roomsList.map(value => {
        if (value.id == newRoom.id) {
            return value = newRoom
        }
    })

    roomsList = updatedRoom
}

const clearRoom = (roomId) => {

    //Remove clients from ROOM
    io.in(roomId).clients((error, socketIds) => {
        if (error) throw error;

        socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(roomId));

    });

    //Remove Room from List
    roomsList = roomsList.filter(value => value.id != roomId)
    io.emit("roomList", roomsList)
}


io.on("connection", (socket) => {

    console.log("client connected");
    io.emit("roomList", roomsList)

    socket.on("setUsername", function (data) {
        socket.username = data
    })

    socket.on("getUsername", function () {
        socket.emit("sendUsername", socket.username)
    })

    socket.on("getRooms", function () {
        socket.emit("roomList", roomsList)
    })

    socket.on("leaveRoom", function (room) {

        console.log("clear room");

        if (room.id) {
            clearRoom(room.id)
        }

        socket.broadcast.in(room.id).emit("abandonRoom", room)

    })

    socket.on('createRoom', function (room) {

        const newRoom = {
            id: room,
            name: room,
            sockets: [],
            game: {
                currentTurn: null,
                winner: null,
                moves: 0,
                board: {
                    0: 0,
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                },
            }
        }

        playerJoin(socket, newRoom)
        roomsList.push(newRoom);
        io.emit("roomList", roomsList)
    });

    socket.on("joinRoom", function (room) {

        playerJoin(socket, room)

        updateRoom(room)

        io.emit("roomList", roomsList)

    })

    socket.on("ready", function () {
        console.log(socket.id, "is ready")

        let room = getRoom(socket.roomId)


        //If 2 clients are in the room start
        if (room && room.sockets.length == 2) {

            console.log("initialize game")

            let room = getRoom(socket.roomId)

            //random 0 1 por first turn
            let firstTurn = room.sockets[Math.floor(Math.random() * Math.floor(2))][0]
            room.game.currentTurn = firstTurn
            updateRoom(room)

            io.in(socket.roomId).emit('playGame', room);

        }
    })

    socket.on("turnPlayed", (room) => {

        console.log("Turn played")

        const winner = checkWinner(room)

        if (winner.length > 0) {

            console.log("Game Finished")

            room.game.winner = winner

            io.in(room.id).emit('gameFinished', room);

            clearRoom(room.id)

        } else {
            let nextTurn = room.sockets.find(socket => socket[0] != room.game.currentTurn)[0];

            room.game.currentTurn = nextTurn
            room.game.moves = room.game.moves + 1

            updateRoom(room)
            console.log("Next Turn")

            io.in(socket.roomId).emit('nextTurn', room);
        }


    })

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));