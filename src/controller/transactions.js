import db from "../config/database.js"
import { ObjectId } from "mongodb"
import { transactionSchema } from "../model/transactionSchema.js"

export async function listTransactions(req, res){
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')

    if (!token) return res.status(422).send("Informe o token!")

    try{
        const findUserId = await db.collection("sections").findOne({ token })

        const findTransactions = await db.collection("transactions").find({idUser: ObjectId(findUserId.userId)}).toArray()
        res.send(findTransactions)
    
    }catch(err){
        return res.status(500).send(err.message);
    }
}

export async function newTransaction(req, res){
    const { value, description, type, date } = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", '')

    if (!token) return res.status(422).send("Informe o token!")

    try{
        const validation = transactionSchema.validate( { value, description, type, date }, {abortEarly: false});
        if(validation.error) {
            const err = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(err);
        };

        const findUserId = await db.collection("sections").findOne({ token });
        const idUser = findUserId.userId;

            const transactionData = {
                value,
                description,
                type,
                date,
                idUser
            }

            await db.collection("transactions").insertOne(transactionData)
            res.sendStatus(201)
        
    }catch(err){
        return res.status(500).send(err.message);
    }
}