import socketIOClient from "socket.io-client";

const socketIO = socketIOClient(process.env.REACT_APP_SOCKET_ENDPOINT)

export default socketIO;