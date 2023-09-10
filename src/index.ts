import App from "./app";
import { Request, Response } from "express";
import { initialize } from "./core/admin";

initialize() // Initialize constants cache core data

// Page not found: must be after all routes
App.use((req: Request, res: Response) => {
    return res.status(404).json({message: `The resource on ${req.originalUrl} could not be found!`});
})