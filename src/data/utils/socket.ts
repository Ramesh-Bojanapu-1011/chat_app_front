import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";
let socket: Socket | null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io({ path: "/api/socket"});
  }
  return socket;
};
