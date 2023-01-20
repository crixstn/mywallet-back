import express, {json} from "express"
import cors from "cors"
import authRouter from "./routes/authRouter.js";

const app = express();
app.use(cors());
app.use(json());
app.use([authRouter])

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Welcome to My Wallet server!")
})