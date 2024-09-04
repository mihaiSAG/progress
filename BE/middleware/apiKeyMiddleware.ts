import { Request, Response, NextFunction } from "express";

const API_KEY = process.env.API_KEY || "";

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('mid')
    const apiKey = req.headers['authorization'];
console.log(API_KEY)
    if (apiKey && apiKey === API_KEY) {
        next(); // API key is valid, proceed to the next middleware or route handler
    } else {
        res.status(401).send("Unauthorized: Invalid API Key");
    }
};
