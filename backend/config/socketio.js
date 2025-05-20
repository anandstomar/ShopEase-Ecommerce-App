const { Server } = require('socket.io');
let io;

function initSocket(server) {
  io = new Server(server, {
    path: '/socket.io',
    cors: { origin: '*' }
  });
  
  io.on('connection', socket => {
    socket.on('joinDriverRoom', driverId => {
      socket.join(`driver_${driverId}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
}

module.exports = { initSocket, getIO };
