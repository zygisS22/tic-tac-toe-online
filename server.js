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
        console.log(`Player ${socket.id} joined  room ${room.id}`)
    });
    room.sockets.push(socket.id)

    socket.emit("joinedRoom", room)

}

const checkWinner = (room) => {

    const board = room.game.board

    let player1Selections = {}
    let player2Selections = {}
    let winner = ""

    Object.values(board).map((value, index) => {
        if (value == room.sockets[0]) {
            player1Selections[index] = value
        } else if (value == room.sockets[1]) {
            player2Selections[index] = value
        }
    })

    player1Selections = Object.keys(player1Selections)
    player2Selections = Object.keys(player2Selections)

    winConditions.forEach(array => {
        let winPlayer1 = player1Selections.length == 3 ? player1Selections.every(e => array.includes(parseInt(e))) : false
        let winPlayer2 = player2Selections.length == 3 ? player2Selections.every(e => array.includes(parseInt(e))) : false

        if (winPlayer1) {
            winner = room.sockets[0]
        } else if (winPlayer2) {
            winner = room.sockets[1]
        }
    })


    if (player1Selections.length == 3 && player2Selections.length == 3 && !winner) return "draw"

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

            console.log("initialize game")

            let room = getRoom(socket.roomId)

            let firstTurn = room.sockets[Math.floor(Math.random())]

            room.game.currentTurn = firstTurn

            //

            let updatedRoom = roomsList.map(value => {
                if (value.id == room.id) {
                    return value = room
                }
            })

            roomsList = updatedRoom

            //

            io.in(socket.roomId).emit('playGame', room);

        }
    })

    socket.on("turnPlayed", (room) => {

        console.log("Turn played")

        //check Winner
        const winner = checkWinner(room)

        if (winner.length > 0) {

            console.log("Game Finished")

            room.game.winner = winner

            io.in(socket.roomId).emit('gameFinished', room);

        } else {
            let nextTurn = room.sockets.find(socket => socket != room.game.currentTurn);

            room.game.currentTurn = nextTurn
            room.game.moves = room.game.moves + 1

            //

            let updatedRoom = roomsList.map(value => {
                if (value.id == room.id) {
                    return value = room
                }
            })

            roomsList = updatedRoom

            //

            console.log("Next Turn")

            io.in(socket.roomId).emit('nextTurn', room);
        }


    })

    socket.on("startGame", () => {

        console.log("Start game")

        let room = getRoom(socket.roomId)

        let firstTurn = room.sockets[Math.floor(Math.random())]

        room.game.currentTurn = firstTurn

        //

        let updatedRoom = roomsList.map(value => {
            if (value.id == room.id) {
                return value = room
            }
        })

        roomsList = updatedRoom

        //

        io.in(socket.roomId).emit('playGame', room);
    })



    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});







server.listen(port, () => console.log(`Listening on port ${port}`));