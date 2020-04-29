import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "react-router-dom"
import RoomList from "../RoomList"
import socketIO from "../socket-client";

const Home = () => {

    const [username, setUsername] = useState("")
    const [allowChange, setAllowChange] = useState(true)
    const history = useHistory()

    const create = () => {

        const roomId = uuidv4();
        socketIO.emit('createRoom', roomId);
        history.push("/game")
    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }

    const lockUsername = () => {
        if (username.length > 0) {
            socketIO.emit('setUsername', username)
            setAllowChange(false)
        }
    }

    useEffect(() => {

        socketIO.emit("getUsername")
        socketIO.on("sendUsername", data => {

            if (data && data.length > 0) {
                setUsername(data)
                setAllowChange(false)
            }

        })

        return () => {
            socketIO.off("sendUsername")
        }


    }, []);

    return (
        <div>
            <h2 align="center">TIC TAC TOE</h2>
            <h3 align="center">ONLINE</h3>

            <div className="form-flex">
                <h3 align="center">Username</h3>
                {allowChange ? (<input type="text" name="username" placeholder="username" value={username} onChange={(e) => handleUsername(e)} />) :
                    (<input type="text" name="username" placeholder="username" value={username} disabled />)}

                {allowChange && (<button onClick={() => lockUsername()}>set</button>)}
            </div>

            {!allowChange && (
                <React.Fragment>

                    <div className="form-flex">
                        <h3 align="center">Create new Room</h3>
                        <button onClick={() => create()}>Create</button>
                    </div>

                    {socketIO && (<RoomList />)}

                </React.Fragment>
            )}
        </div>

    )
}

export default Home