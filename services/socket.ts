// services/socket.js

import { Server, ServerOptions } from 'socket.io';

let io: any;

function initializeSocket(server: Partial<ServerOptions> | undefined) {
  io = new Server(server);
  io.on('connection', (socket: { id: any; }) => {
    console.log('Client connected:', socket.id);
    // Handle real-time events from clients if needed
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

export { initializeSocket, getIO };
