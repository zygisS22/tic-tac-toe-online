import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import socketIOClient from "socket.io-client";




const Home = () => {

    const [newRoomPassword, setNewRoomPassword] = useState("")
    const newPasswordHandle = (event) => {
        event.preventDefault()
        setNewRoomPassword(event.target.value)
    }

    const create = () => {

        const roomId = uuidv4();
        console.log("room id", roomId)
        console.log("password", newRoomPassword)
        console.log("created")
        const socket = socketIOClient(process.env.REACT_APP_SOCKET_ENDPOINT);
        socket.emit('room', { roomId: roomId, password: newRoomPassword });
    }

    useEffect(() => {

    }, []);


    return (
        <div>
            <h2 align="center">TIC TAC TOE</h2>

            <div className="form-flex">
                <h3 align="center">Create new Room</h3>
                <label>password</label>
                <input onChange={(e) => newPasswordHandle(e)} value={newRoomPassword} name="newRoomPassword" type="text" />
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

        </div>


    )
}

export default Home