import React, { useEffect, useState } from "react"

import socketIO from "../socket-client";

const RoomList = () => {

    const [rooms, setRooms] = useState(null)

    useEffect(() => {


        socketIO.on("roomList", data => {
            console.log(data)
            setRooms(data)
        })

        // return () => {
        //     socketIO.off("roomList")
        // }
    }, [])

    return (
        <div>
            <h2>rooms available</h2>
            {rooms && rooms.map((value, index) => {
                return <div key={index}>Room id {value}  <button onClick={() => socketIO.emit('joinRoom', value)}><span>entrar</span></button></div>
            })}
        </div>

    )
}

export default RoomList