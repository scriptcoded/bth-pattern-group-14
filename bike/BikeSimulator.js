const axios = require("axios").default;
require('dotenv').config();


const Bike = require('./Bike');
const BikeStatusEmitter = require('./BikeStatusEmitter');
const IOMocker = require('./IOMocker');



axios.get('http://localhost:4000/bikes')
    .then((res)=>{
        const size = res.data.data.length;
        console.log("Start simulating.... with " + size + " bikes");
        res.data.data.forEach(bikeInfo => {
            let bike = new Bike(new IOMocker(bikeInfo), new BikeStatusEmitter(), bikeInfo.id);
            setTimeout(()=>{
                bike.start();
                console.log("bike with id: ", bikeInfo.id, "is online!"); 
            }, Math.floor(Math.random() * size * 60));
            });
    })
    .catch((err) => {
        console.log(err);
    });
