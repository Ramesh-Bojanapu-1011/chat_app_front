import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://chat-app-front-rose.vercel.app/'
    : 'http://localhost:3000/'; // Local WebSocket server
let socket: Socket | null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, { path: '/api/socket' });
  }
  return socket;
};
