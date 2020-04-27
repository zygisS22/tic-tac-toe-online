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

        console.log(socketIO)

        socketIO.on("joinedRoom", function () {
            socketIO.emit("ready")
        });

        socketIO.on("playGame", function (data) {
            console.log(data)
            setGameInfo(data)
            setGameStatus("playing")
        });

        socketIO.on("nextTurn", function (room) {
            console.log("new Data", room)
            setGameInfo(room)
        })

        socketIO.on("gameFinished", function (room) {
            console.log("game Finished", room)
            setGameInfo(room)
            setGameStatus("finished")
        })

    }, []);

    return (
        <div>
            <h2>Game</h2><br />
            <button onClick={() => history.push("/")}>Go back</button>
            {gameStatus == "playing" ? (<Board gameInfo={gameInfo} player={player} />) : gameStatus == "finished" ? (
                <div>
                    {gameInfo.game.winner == "draw" ? (<h2> {gameInfo.game.winner} !</h2>) : <h2>Winner {gameInfo.game.winner} !</h2>}

                </div>
            ) : (<p>Waiting for a player to join...</p>)}
        </div>

    )
}

export default Game