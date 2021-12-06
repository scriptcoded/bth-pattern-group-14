/** Class representing a bike. */
class Bike {
     /**
     * Create a Bike.
     * @param {IoModule} io - The io module.
     */
    constructor(io, emitter, id) {
        this.id = id;
        this.io = io;
        this.emitter = emitter;
    }

    start() {
        this.io.start();
        this.emitter.io = this.io;
        this.emitter.id = this.id;
        this.emitter.start();
    }
}


module.exports = Bike;
