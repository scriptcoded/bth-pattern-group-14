const { Server } = require('socket.io');

/**
 * Init the socket server 
 *
 * @param  httpServer httpServer
 * @param  {import('node-cache')} bikeCache
 * @returns {Server}
 */
const initSocketServer = (httpServer, bikeCache) => {
    const io = new Server(httpServer);

    io.on('connection', socket => {
        console.log('Bike connected with id: ' + socket.handshake.query.bikeId + "\tTotal socketconnections: " + io.engine.clientsCount);

        socket.on('update', (data, emit) => {
            bikeCache.set(data.id, data);
            socket.emit('updated', emit);
        });
    });

    return io;
};

module.exports = initSocketServer;
