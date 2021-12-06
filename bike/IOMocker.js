const IO = require('./IO');

class IOMocker extends IO {
    static interval = process.env.MOCK_INTERVAL || 500;

    constructor(status) {
        super();
        this.battery = parseFloat(status.battery) || Math.floor(Math.random() * 100);
        this.longitude = parseFloat(status.longitude) || 50;
        this.latitude = parseInt(status.latitude) || 50;
    }

    start() {
        setInterval(()=>{
            const longStep = Math.random() * (Math.round(Math.random()) * 2 - 1) * IO.maxMeterSec / IOMocker.meterDeg;
            const latStep = Math.random() * (Math.round(Math.random()) * 2 - 1) * IO.maxMeterSec / IOMocker.meterDeg;

            this.latitude = this.latitude + latStep;
            this.longitude = this.longitude + longStep;
            

            if (this.battery > 0) {
                this.battery = this.battery - 1;
            }
        }
        ,IOMocker.interval)
    }
}

module.exports = IOMocker;