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

    const circle = <FontAwesomeIcon icon={faCircle} color="red" />
    const times = <FontAwesomeIcon icon={faTimes} color="blue" />

    useEffect(() => {

        socketIO.on("joinedRoom", function (room) {
            setGameInfo(room)
            socketIO.emit("ready")
        });

        socketIO.on("playGame", function (data) {
            setGameInfo(data)
            setGameStatus("playing")
        });

        socketIO.on("nextTurn", function (room) {
            setGameInfo(room)
        })

        socketIO.on("gameFinished", function (room) {
            setGameInfo(room)
            setGameStatus("finished")
        })

        socketIO.on("abandonRoom", function (room) {
            history.push("/")
        })

    }, []);


    const leaveMatch = () => {
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