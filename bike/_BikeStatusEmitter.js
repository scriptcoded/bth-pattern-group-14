const http = require("http");


// const httpAgent = new http.Agent({ keepAlive: true })

// const axios = require("axios").create({httpAgent});


class BikeStatusEmitter {
    static emitInterval = process.env.EMIT_INTERVAL || 1000;
    static requests = 0;
    static responses = 0;
    static errors = 0;
    static axios = require("axios").create({httpAgent: new http.Agent({ keepAlive: true })});


    constructor(io, id) {
        this.id = id,
        this.io = io;
        this.req = false;
        this.res = true;
        this.timeElapsed = 0;
    }

    start(emitInterval) {
        setInterval(()=>{
           
            BikeStatusEmitter.requests++;
            const start = Date.now();

            if (this.res) {
                this.res = false;
                BikeStatusEmitter.axios.patch("http://localhost:4000/bike/" + this.id + "?db=1",
                        {
                            id: `${this.id}`,
                            latitude: this.io.latitude,
                            longitude: this.io.longitude,
                            battery: this.io.battery
                        },
                        {
                            headers: {
                            "Content-type": "application/json; charset=UTF-8",
                            },
                            timeout: 1000
                    }
                )
                .then(res => {
                    BikeStatusEmitter.responses++;
                    //console.log(res.data);
                })
                .catch(err => {
                    BikeStatusEmitter.errors++;
                    // Handle Error Here
                    // console.error(err);
                })
                .finally(()=> {
                    this.res = true;
                    this.timeElapsed = Date.now() - start;
                    console.log(this.timeElapsed, "\t", BikeStatusEmitter.requests, "\t",BikeStatusEmitter. responses, " \t", BikeStatusEmitter.errors, " \t", this.id, "\t", this.io.latitude, "\t", this.io.longitude, "\t", this.io.battery);
                });
            }
        }, emitInterval || BikeStatusEmitter.emitInterval);
    }

}

module.exports = BikeStatusEmitter;