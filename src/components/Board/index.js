import React, { useEffect } from "react"
import socketIO from "../socket-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'


const Board = ({ gameInfo, player }) => {

    useEffect(() => { }, [gameInfo])

    const printSimbol = (value) => {

        if (value == 0) {
            return ""
        } else if (gameInfo.sockets[0][0] == value) {
            //Player1
            return (<FontAwesomeIcon icon={faTimes} color="blue" />)

        } else if (gameInfo.sockets[1][0] == value) {
            //Player2
            return (<FontAwesomeIcon icon={faCircle} color="red" />)
        }

    }

    const handleSquare = (boardNumber) => {
        //If its your turn and the board is empty
        if (gameInfo.game.board[boardNumber] == 0 && player == gameInfo.game.currentTurn) {
            let updateGame = gameInfo
            updateGame.game.board[boardNumber] = player
            socketIO.emit("turnPlayed", updateGame)

        }
    }

    if (!gameInfo) return ("waiting for data")

    return (
        <div>
            <h2>board</h2>

            <h4> --> {player == gameInfo.game.currentTurn ? "Your Turn" : "Opponents Turn"}</h4>

            <div className="board-container">
                {gameInfo && gameInfo.game && Object.keys(gameInfo.game.board).map(function (key, index) {
                    return <div className="square" onClick={() => handleSquare(key)}>{printSimbol(gameInfo.game.board[key])}</div>
                })}
            </div>


        </div>

    )
}

export default Board