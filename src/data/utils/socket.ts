import { io, Socket } from 'socket.io-client';

let socket: Socket | null;

const siteurl =
  process.env.NODE_ENV == 'production'
    ? 'https://chat-app-front-rose.vercel.app/'
    : undefined;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(siteurl, {
      path: '/api/socket',
      // transports: ['websocket'], // Force WebSocket transport
    });
  }
  return socket;
};
