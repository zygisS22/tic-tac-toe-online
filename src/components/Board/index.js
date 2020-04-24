import React, { useEffect, useState } from "react"




const Board = () => {


    const [board, setBoard] = useState({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,

    })

    return (
        <div>
            <h2>board</h2>

            <div className="board-container">
                {/* {board.map(item => {
                    return <div className="square">HI</div>
                })} */}

                {Object.keys(board).map(function (key, index) {
                    return <div className="square">{board[key]}</div>
                })}
            </div>


        </div>

    )
}

export default Board