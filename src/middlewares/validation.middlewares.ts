import {Request, Response, NextFunction} from "express";
import { AnyZodObject, ZodError } from "zod"

export default (schema: AnyZodObject) => 
    (req: Request, res: Response, next: NextFunction) => {

        try {
            schema.parse({

                body: req.body,

                params: req.params,

                query: req.query

            })

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                const uri = req.path
                const method = req.method
                const data = error.issues.map((issue,_,errors) => {
                    return {
                        key: issue.path.join(" > "),
                        messages: errors.filter(error => error.path === issue.path)
                                        .map(error => error.message)
                    }
                })

                res.status(400).send({
                    success: false,
                    message: `Validation error on route: ${uri} with method ${method}`,
                    data
                })
            }
        }
    }