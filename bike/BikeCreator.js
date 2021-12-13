const axios = require("axios").default;

console.log("Start filling database with bikes....");

const func = async ()=>{
    for (i=1;i<1001;i++) {

        const data = { 
            latitude: 57 + Math.random(),
            longitude: 15 + Math.random(),
            battery: 99,
            speed: 0
         };
    
        let res = await axios.post('http://localhost:4000/bikes', data, 
            {
                headers: {
                "Content-type": "application/json; charset=UTF-8",
                }
            });
        console.log("created bike with ide : ", res.data.data.id, "\ttotal: ", i);
    };
}


func();