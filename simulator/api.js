const axios = require("axios").default;

const getAllBikes = async ()=>{
    try {
        const res = await axios.get('http://localhost:4000/bikes');
        return res.data.data;
    } catch (err) {
        console.log(err);
    }
}
const getAllUsers = async ()=>{
    try {
       const res =  await axios.get('http://localhost:4000/users');
       return res.data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
}

const startRide = async (id) => {
    try {
        const res =  await axios.post(`http://localhost:4000/bikes/${id}/start`);
        return res.data.data;
     } catch (err) {
         console.log(err);
         return [];
     }
}

module.exports = { getAllBikes, getAllUsers, startRide }