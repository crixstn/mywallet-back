import { listTransactions, newTransaction } from "../controller/transactions.js"
import { Router } from 'express'

const transactionsRouter = Router()

transactionsRouter.get("/transactions", listTransactions);
transactionsRouter.post("/newTransaction", newTransaction);

export default transactionsRouter
