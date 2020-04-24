import React, { useEffect, useState } from "react"

import socketIO from "../socket-client";




const Board = ({ gameInfo, player }) => {


    const [turn, setTurn] = useState(null)
    //const board = gameInfo.game.board


    useEffect(() => {

        console.log(gameInfo)

        // if (player == gameInfo.game.currentTurn) {
        //     setTurn(true)
        // } else {
        //     setTurn(false)
        // }

    }, [gameInfo])

    const handleSquare = (boardNumber) => {

        console.log("player id", player)
        console.log("CurrentTurn", gameInfo.game.currentTurn)

        console.log(gameInfo.game.board[boardNumber] == 0)
        console.log(player == gameInfo.game.currentTurn)

        if (gameInfo.game.board[boardNumber] == 0 && player == gameInfo.game.currentTurn) {

            let updateGame = gameInfo

            updateGame.game.board[boardNumber] = player

            socketIO.emit("turnPlayed", updateGame)

            console.log("Turno jugado")


        }
    }

    if (!gameInfo) return ("waiting for data")

    return (
        <div>
            <h2>board</h2>

            {/* <h4> --> {turn ? "Your Turn" : "Opponents Turn"}</h4> */}

            <div className="board-container">
                {/* {board.map(item => {
                    return <div className="square">HI</div>
                })} */}

                {gameInfo && gameInfo.game && Object.keys(gameInfo.game.board).map(function (key, index) {
                    return <div className="square" onClick={() => handleSquare(key)}>{gameInfo.game.board[key]}</div>
                })}
            </div>


        </div>

    )
}

export default Board