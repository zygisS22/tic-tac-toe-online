import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';


import RoomList from "../RoomList"

import socketIO from "../socket-client";




const Home = () => {

    //const [socketIO, setSocketIO] = useState(socketIOClient(process.env.REACT_APP_SOCKET_ENDPOINT))
    const [roomId, setRoomId] = useState(null)


    const create = () => {

        const roomId = uuidv4();
        socketIO.emit('createRoom', roomId);

    }

    useEffect(() => {

        socketIO.on("joinedRoom", function (data) {
            console.log(data);
        });



        return () => {
            socketIO.off("joinedRoom")
        }


    }, []);


    return (
        <div>
            <h2 align="center">TIC TAC TOE</h2>

            <div className="form-flex">
                <h3 align="center">Create new Room</h3>
                <button onClick={() => create()}>Create</button>
            </div>

            <div className="form-flex">
                <h3 align="center">Join a Room</h3>
                <label>room identifier</label>
                <input type="text" />
                <label>password</label>
                <input type="text" />
                <button>Connect</button>
            </div>

            {socketIO && (<RoomList />)}


        </div>


    )
}

export default Home