// const Bike = require("./B")
const api = require("./api");

class User {
    constructor(data) {
        this.data = data;
        this.bike = null;

    }

    start() {
        console.log(`User: ${this.data.name} with id: ${this.data.id} is online!`);
        this.initActionInterval();
    }

    async startRide() {
        const bike = await this.chooseBike();
        const ride = await api.startRide(bike.id);
        console.log(`User ${this.data.name} strated this ride: ${res.data.data}`);
    }

    endRide() {

    }

    async chooseBike () {
        const bikes = await api.getAllBikes();
        const availableBikes = bikes.filter(bike => !bike.disabled);

        return availableBikes.pop();
    }

    initActionInterval() {
        setInterval(()=>{
            const randomChoice = Math.round(Math.random());

            randomChoice? this.endRide() : this.startRide(); 

        }, 1000 * Math.floor(Math.random() * 1000))
    }
}






module.exports = User;

// id        String   @id @default(cuid())
// createdAt DateTime @default(now())
// updatedAt DateTime @updatedAt

// name     String
// githubId String @unique

// role Role @default(USER)

// balance Decimal @default(0) @db.Decimal(15, 2)

// rides Ride[]

// apiCalls Int @default(0)

// model Bike {
//     id        String   @id
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
  
//     token String
  
//     latitude  Decimal @db.Decimal(8, 6)
//     longitude Decimal @db.Decimal(8, 6)
  
//     battery  Int     @default(0)
//     speed    Float   @default(0)
//     disabled Boolean @default(false)
  
//     rides Ride[]
//   }