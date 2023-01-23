import joi from "joi";

export const transactionSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().min(4).max(25).required(),
    type: joi.string().valid("expense", "income").required(),
    date: joi.date().required()
});
