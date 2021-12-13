const csvFileName = './FakeNameGenerator.com_06d4fd6e/FakeNameGenerator.com_06d4fd6e.csv';
const fs = require('fs');

const axios = require("axios").default;
const User = require("./User");
const api = require("./api");
// require("dotenv").config();

const readAllNamesFile = () => {
    const data = fs.readFileSync(csvFileName, {encoding:'utf8', flag:'r'});
    return data.split('\n');
}


const createUserinDb = async () => {
    const data = await axios
        .post("http://localhost:4000/users", userInfo, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
    return data.data.data;
}


const createAllUsersInDB = async userInfo => {
    const names = readAllNamesFile();

    for (i = 0; i < names.length; i++) {
        await createUserinDb({
            name: names[i],
            githubId: "github-" + names[i] + "-" + i,
            role: "USER",
            balance: 200
        });
    }
}

const initAllUsersFromDB = async () => {
    const users = await api.getAllUsers();
    
    users.forEach(userData => {
        new User(userData).start();
    });
}



module.exports.createUserinDb = createUserinDb;
module.exports.readAllNamesFile = readAllNamesFile;
module.exports.createAllUsersInDB = createAllUsersInDB;
module.exports.initAllUsersFromDB = initAllUsersFromDB;



/* 
id        String   @id @default(cuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

name     String
githubId String @unique

role Role @default(USER)

balance Decimal @default(0) @db.Decimal(15, 2)

rides Ride[]

apiCalls Int @default(0) */