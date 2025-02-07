import { io, Socket } from 'socket.io-client';

let socket: Socket | null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.SITE_URL, { path: '/api/socket' });
  }
  return socket;
};
