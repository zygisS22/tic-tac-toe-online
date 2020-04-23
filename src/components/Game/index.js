import React, { useEffect, useState } from "react"

import Board from "../Board"
import socketIO from "../socket-client";
import { useHistory } from "react-router-dom"


const Game = () => {

    const [player2, setPlayer2] = useState(false)
    const history = useHistory()
    useEffect(() => {

        socketIO.on("joinedRoom", function (data) {
            socketIO.emit("ready")
        });



        return () => {
            socketIO.off("joinedRoom")
        }


    }, []);

    return (
        <div>
            <h2>Game</h2><br />
            <button onClick={() => history.push("/")}>Go back</button>
            {player2 ? (<Board />) : (<p>Waiting for a player to join...</p>)}
        </div>

    )
}

export default Game