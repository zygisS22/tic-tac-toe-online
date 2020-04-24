import React, { useEffect, useState } from "react"

import Board from "../Board"
import socketIO from "../socket-client";
import { useHistory } from "react-router-dom"


const Game = () => {

    const [gameStatus, setGameStatus] = useState(false)
    const history = useHistory()
    useEffect(() => {

        socketIO.on("joinedRoom", function () {
            socketIO.emit("ready")
        });

        socketIO.on("initGame", function (data) {

            socketIO.emit("startGame")
        });

        socketIO.on("playGame", function (data) {

            setGameStatus(true)

            //socketIO.emit("startGame")
        });



        // return () => {
        //     socketIO.off("joinedRoom")
        // }


    }, []);

    return (
        <div>
            <h2>Game</h2><br />
            <button onClick={() => history.push("/")}>Go back</button>
            {gameStatus ? (<Board />) : (<p>Waiting for a player to join...</p>)}
        </div>

    )
}

export default Game