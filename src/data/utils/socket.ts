import { io, Socket } from 'socket.io-client';

let socket: Socket | null;

const siteurl =
  process.env.NODE_ENV == 'production'
    ? 'https://chat-app-back-2ace.onrender.com'
    : 'http://localhost:5000';

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(
      siteurl
      // { withCredentials: true }
    );
  }
  return socket;
};
