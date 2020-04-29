import React, { useEffect, useState } from "react"

import Board from "../Board"
import socketIO from "../socket-client";
import { useHistory } from "react-router-dom"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'


const Game = () => {

    const [gameStatus, setGameStatus] = useState(false)
    const [gameInfo, setGameInfo] = useState({})
    const player = socketIO.id
    const history = useHistory()


    const circle = <FontAwesomeIcon icon={faCircle} color="blue" />
    const times = <FontAwesomeIcon icon={faTimes} color="red" />

    useEffect(() => {

        console.log(socketIO)

        socketIO.on("joinedRoom", function (room) {

            console.log("JOINED", room)
            setGameInfo(room)
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


    const leaveMatch = () => {

        console.log("leave", gameInfo)

        socketIO.emit("leaveRoom", gameInfo)

        history.push("/")
    }

    return (
        <div className="game-container">
            <h2 align="center">Game</h2>
            {gameInfo && (<h3 align="center">{gameInfo.id}</h3>)}
            <button onClick={() => leaveMatch()}>Leave</button>
            {gameInfo && gameInfo.sockets && gameInfo.sockets.length > 1 && (<h3>{gameInfo.sockets[0][1]} {times}  |  {gameInfo.sockets[1][1]} {circle}</h3>)}

            {gameStatus == "playing" ? (<Board gameInfo={gameInfo} player={player} />) : gameStatus == "finished" ? (
                <div>
                    {gameInfo.game.winner == "draw" ? (<h2> {gameInfo.game.winner} !</h2>) : <h2>Winner {gameInfo.game.winner} !</h2>}

                </div>
            ) : (<p>Waiting for a player to join...</p>)}
        </div>

    )
}

export default Game