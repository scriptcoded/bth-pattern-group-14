const socket = require("socket.io-client");
const chalk = require('chalk');



class BikeStatusEmitter {
    static SOCKET_URL = process.env.SOCKET_URL || "ws://localhost:4000";
    static emitInterval = process.env.EMIT_INTERVAL || 1000;
    static emits = 0;
    static responses = 0;
    static errors = 0;
    static connections = 0;
    static disconnects = 0;


    constructor(io, id) {
        this.id = id,
        this.io = io;
        this.req = 0;
        this.res = true;
        this.emits = 0;
        this.timeElapsed = 0;
        this.socket = null;
        this.connections = 0;
    }

    static colorTime(timeElapsed) {
        switch(true) {
            case (timeElapsed>1000):
                return chalk.red(timeElapsed);
                break;
            case (timeElapsed>50):
                return chalk.yellow(timeElapsed);
                break;
            case (timeElapsed)>0:
                return chalk.green(timeElapsed);
                break;
            default:
                return chalk.white(timeElapsed);
                break;
        }
    };

    start(emitInterval) {
        let start = Date.now();
        this.socket = socket(BikeStatusEmitter.SOCKET_URL, {query: {bikeId: this.id}});

        this.socket.on('connect', (id) => {
            BikeStatusEmitter.connections++;
        });

        this.socket.on('disconnect', (id) => {
            BikeStatusEmitter.disconnects++;
        });

        this.socket.on('connect_error', (id) => {
            this.connect_errors++;
            BikeStatusEmitter.errors++;
        });

        this.socket.on("updated", (emit)=>{
            BikeStatusEmitter.responses++
            this.timeElapsed = Date.now() - start;

            console.log(
                " ",
                BikeStatusEmitter.colorTime(this.timeElapsed), "\t", 
                BikeStatusEmitter.emits, BikeStatusEmitter.responses , BikeStatusEmitter.responses - BikeStatusEmitter.emits, "\t", 
                BikeStatusEmitter.connections , BikeStatusEmitter.disconnects, BikeStatusEmitter.errors, "\t", 
                this.id);
        });

        setInterval(()=>{
            start = Date.now();
            BikeStatusEmitter.emits++;

            this.emits++;
            this.socket.emit("update",
                    {
                        id: `${this.id}`,
                        latitude: this.io.latitude,
                        longitude: this.io.longitude,
                        battery: this.io.battery
                    },
                    this.emits
            );
        }, emitInterval || BikeStatusEmitter.emitInterval);
    }
}

module.exports = BikeStatusEmitter;