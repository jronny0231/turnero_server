import { Request, Response } from 'express';

export const GetConfig = async (req: Request, res: Response) => {
    const userId: number = Number(res.locals.payload.id)
    const queryParams: object = req.query;

    /*
    queueModel.GetAll().then((queues => {
       
        const data = queues.map((queue) => {
            return <Servicios> ObjectFiltering(queue, OUTPUT_TYPES_TURNOS);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
    */

    // Testing controller
    res.json({success: true, queryParams, userId});
}