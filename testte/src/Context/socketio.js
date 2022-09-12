import socketio from "socket.io-client";
import React from "react";
const SOCKET_URL=process.env.REACT_APP_SOCKET

export const socket = socketio.connect(SOCKET_URL,{transports: ["websocket", "polling"] });// use WebSocket first, if available
export const SocketContext = React.createContext(); 