const { Server } = require('socket.io');

let io = null;


/**
 * Init the socket server 
 *
 * @param  httpServer httpServer
 * @param  {import('node-cache')} bikeCache
 * @returns {Server}
 */
const initSocketServer = (httpServer, bikeCache) => {
    io = new Server(httpServer);

    io.on('connection', socket => {
        const bikeId = socket.handshake.query.bikeId;

        socket.join(bikeId);

        socket.on('update', (data, emit) => {
            bikeCache.set(data.id, data);
            socket.emit('updated', emit);
        });

        console.log('Bike connected with id: ' + bikeId + "\tTotal socketconnections: " + io.engine.clientsCount);
    });

    return io;
};

const emitUnlockToBike = (id, cb) => {
    io.to(id).emit("unlock", data, (response)=>cb(response));
}

const emitLockToBike = (id, cb) => {
    io.to(id).emit("lock", data, (response)=>cb(response));
}

const emitUpdateToBike = (id, data, cb) => {
    io.to(id).emit("update", data, (response)=>cb(response));
}

module.exports = { initSocketServer, emitUnlockToBike, emitLockToBike, emitUpdateToBike };
