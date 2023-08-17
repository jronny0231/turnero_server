import App from "./app";
import { Response } from "express";
import { initialize } from "./core/admin";

initialize() // Initialize constants cache core data

// Page not found: must be after all routes
App.use('/*', (_req, res: Response) => {
    return res.status(404).json({message: "Page not found!"});
})