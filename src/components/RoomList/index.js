import React, { useEffect, useState } from "react"

import socketIO from "../socket-client";
import { useHistory } from "react-router-dom"

const RoomList = () => {

    const [rooms, setRooms] = useState(null)
    const history = useHistory()

    const joinRoom = (room) => {
        socketIO.emit('joinRoom', room)
        history.push("/game")
    }

    useEffect(() => {

        socketIO.emit("getRooms")


        socketIO.on("roomList", data => {
            console.log("rooms", data)
            setRooms(data)
        })

        return () => {
            socketIO.off("roomList")
        }
    }, [])

    return (
        <div className="room-list">
            <h2 align="center">rooms available</h2>
            {rooms && rooms.map((value, index) => {

                if (value.sockets.length < 2) {
                    return <div className="room-item" key={index}>Room id {value.id}  <button onClick={() => joinRoom(value)}><span>entrar</span></button></div>
                }


            })}
        </div>

    )
}

export default RoomList