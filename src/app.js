import express, {json} from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from 'mongodb'
import joi from "joi"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

dotenv.config();
const token = uuid();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try{
    await mongoClient.connect();
    db = mongoClient.db();
    console.log(`Successfully connected to the database :D`);
} catch (err) {
    console.log(`:( Error: ${err}`);
};

const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required()
});

const app = express();
app.use(cors());
app.use(json());

app.post("/sign-up", async (req, res) => {
    const user = req.body;
   
    try{
        const validation = userSchema.validate(user, {abortEarly: false});
        if(validation.error) {
            const err = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(err);
        };

        const hash = bcrypt.hashSync(user.password, 10);

        await db.collection("users").insertOne({ ...user, password: hash});
        res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    };

});

app

const PORT = 5000
app.listen(PORT, () => {
    console.log("Welcome to My Wallet server!")
})