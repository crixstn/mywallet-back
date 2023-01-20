import { MongoClient } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();


const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db

try{
    await mongoClient.connect();
    db = mongoClient.db();
    console.log(`Successfully connected to the database :D`);
}catch(err){
    console.log(`:( Error: ${err}`);
};

export default db;