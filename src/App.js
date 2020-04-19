import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("test", response => {
      setResponse(response);
    });
  }, []);

  return (
    <h2 align="center">O_O {response}</h2>
  );
}

export default App;