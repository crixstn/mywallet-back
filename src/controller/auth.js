import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import db from "../config/database.js";
import { userSchema, loginSchema } from "../model/authSchema.js";

export async function signUp(req, res){
    const { name, email, password } = req.body;
   
    try{
        const userExists = await db.collection('users').findOne({ email: email })
        if(userExists) return res.status(409).send("Este email pertence a outra conta.")

        const validation = userSchema.validate( { name, email, password }, {abortEarly: false});
        if(validation.error) {
            const err = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(err);
        };

        const passwordHashed = bcrypt.hashSync(password, 10);

        await db.collection("users").insertOne( { name, email, password: passwordHashed });
        res.sendStatus(201);
    }catch(err){
        return res.status(500).send(err.message);
    };
}

export async function signIn(req, res){
    const {email, password} = req.body;

    try{
        const validation = loginSchema.validate( { email, password }, {abortEarly: false});
        if(validation.error) {
            const err = validation.error.details.map((detail) => detail.message);
            return res.status(422).send(err);
        };

        const userExists = await db.collection('users').findOne({ email });
        if (!userExists) return res.status(400).send("Dados incorretos");


        const checkPassword = bcrypt.compareSync(password, userExists.password);
        if (!checkPassword) return res.status(400).send("Dados incorretos");

        const token = uuidV4();
        const userDatas = {
            name: userExists.name,
            token
        }

        await db.collection("sections").insertOne({ userId: userExists._id, token })
        return res.status(200).send(userDatas)
    }catch(err){
        return res.status(500).send(err.message);
    };
}
