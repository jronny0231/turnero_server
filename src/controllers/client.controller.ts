import { Request, Response } from 'express';
import { GetAll, Store, GetById } from '../models/client.model';
import { Clientes } from '@prisma/client';
import { ObjectDifferences, ObjectFiltering } from '../utils/filtering';

/**
    id: number;
    nombre: string;
    apellidos: string;
    tipo_identificacion_id: number;
    identificacion: string;
    seguro_id: number;
    nombre_tutorado: string | null;
    fecha_ultima_visita: Date | null;
    estatus: boolean;
    registrado_por_id: number;
    modificado_por_id: number | null;
    createdAt: Date;
    updatedAt: Date;
 */
const INPUT_TYPES_CLIENTES: string[] = ['nombre','apellidos','tipo_identificacion_id','identificacion','seguro_id','nombre_tutorado'];
const OUTPUT_TYPES_CLIENTES: string[] = ['id','nombre','apellidos','tipo_identificacion','identificacion','seguro','nombre_tutorado','fecha_ultima_visita','estatus','registrado_por_id','createdAt'];

export const GetAllClients = ((_req: Request, res: Response) => {
    GetAll().then((Clients => {
       
        const data = Clients.map((Clients) => {
            return <Clientes> ObjectFiltering(Clients, OUTPUT_TYPES_CLIENTES);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})


export const GetClientsById = ((req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    GetById(id).then((user => {
        const data = <Clientes> ObjectFiltering(user, OUTPUT_TYPES_CLIENTES);

        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})

export const StoreNewClients = ((req: Request, res: Response) => {
    const data: Clientes = req.body;

    if(ObjectDifferences(data, INPUT_TYPES_CLIENTES).length > 0){
        return res.status(400).json({message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_CLIENTES})
    }
    
    Store(data).then((newClients) => {
        const data = <Clientes> ObjectFiltering(newClients, OUTPUT_TYPES_CLIENTES);

            return res.send({message: 'Clients created successfully!', data});
    
    }).catch(async (error) => {

        if(error.code === 'P2000')
            return res.status(400).send({error: 'A field is too longer.', message: error.message});
        
        return res.status(400).send({error: error.message});
    })
    return
})

export const UpdateClients = ((_req: Request, res: Response) => {
    res.send('Update a Clientes');
})

export const DeleteClients = ((_req: Request, res: Response) => {
    res.send('Delete a Clientes');
})