import express, {json} from "express"
import cors from "cors"
import authRouter from "./routes/authRouter.js";
import transactionsRouter from "./routes/transactionsRouter.js";

const app = express();
app.use(cors());
app.use(json());
app.use([authRouter, transactionsRouter])

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Welcome to My Wallet server!")
})