import React, { useEffect, useState } from "react"

import Board from "../Board"
import socketIO from "../socket-client";
import { useHistory } from "react-router-dom"


const Game = () => {

    const [gameStatus, setGameStatus] = useState(false)
    const [gameInfo, setGameInfo] = useState({})
    const player = socketIO.id
    const history = useHistory()


    // socketIO.on("initGame", function () {

    //     console.log("inicia esto ya")
    //     socketIO.removeListener("initGame")
    //     socketIO.emit("startGame")
    // });

    useEffect(() => {

        socketIO.on("joinedRoom", function () {
            socketIO.emit("ready")
        });

        socketIO.on("playGame", function (data) {
            console.log(data)
            setGameInfo(data)
            setGameStatus(true)
        });

        socketIO.on("nextTurn", function (room) {
            console.log("new Data", room)
            setGameInfo(room)
        })

    }, []);

    return (
        <div>
            <h2>Game</h2><br />
            <button onClick={() => history.push("/")}>Go back</button>
            {gameStatus ? (<Board gameInfo={gameInfo} player={player} />) : (<p>Waiting for a player to join...</p>)}
        </div>

    )
}

export default Game