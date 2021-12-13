const IO = require('./IO');

class IOMocker extends IO {
    static interval = process.env.MOCK_INTERVAL || 500;

    constructor(status) {
        super();
        this.battery = parseFloat(status.battery) || Math.floor(Math.random() * 100);
        this.longitude = parseFloat(status.longitude) || 50;
        this.latitude = parseInt(status.latitude) || 50;
        this.speed = parseInt(status.speed) || 0;

        this.longStep = Math.random() * (Math.round(Math.random()) * 2 - 1) * IO.maxMeterSec / IOMocker.meterDeg;
        this.latStep = Math.random() * (Math.round(Math.random()) * 2 - 1) * IO.maxMeterSec / IOMocker.meterDeg;
    }

    start() {
        setInterval(()=>{
            this.latitude = this.latitude + latStep * this.speed / 100;
            this.longitude = this.longitude + longStep * this.speed / 100;
            

            if (this.battery > 0) {
                this.battery = this.battery - this.speed / 100;
            }
        }
        ,IOMocker.interval)
    }
}

module.exports = IOMocker;