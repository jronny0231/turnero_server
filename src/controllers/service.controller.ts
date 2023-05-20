import { Request, Response } from 'express';
import { GetAll, Store, GetsBy } from '../models/service.model';
import { Servicios } from '@prisma/client';
import { ObjectDifferences, ObjectFiltering } from '../utils/filtering';

/**
    id: number;
    descripcion: string;
    nombre_corto: string;
    prefijo: string;
    grupo_id: number;
    es_seleccionable: boolean;
    estatus: boolean;
 */
const INPUT_TYPES_SERVICIOS: string[] = ['descripcion','nombre_corto','prefijo','grupo_id','es_seleccionable'];
const OUTPUT_TYPES_SERVICIOS: string[] = ['id','descripcion','nombre_corto','prefijo','grupo','es_seleccionable'];

export const GetAllServices = ((_req: Request, res: Response) => {
    GetAll().then((services => {
       
        const data = services.map((service) => {
            return <Servicios> ObjectFiltering(service, OUTPUT_TYPES_SERVICIOS);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})

export const GetAllServicesByServiceGroup = ((req: Request <{ id: number}>, res: Response) => {
    const grupo_id: number = Number(req.params.id);
    GetsBy({grupo_id}).then((services => {
       
        const data = services.map((service) => {
            return <Servicios> ObjectFiltering(service, OUTPUT_TYPES_SERVICIOS);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})

/**
 * Debe buscar todos los servicios que cumplan con los siguientes criterios:
 * - Servicios.es_seleccionable = true,
 * - JOIN (Servicios_Sucursales) donde:
 * -- sucursal_id = sucursal actual
 * -- disponible = true
 */
export const GetAllSeletableServicesByServiceGroup = ((req: Request <{ id: number}>, res: Response) => {
    const grupo_id: number = Number(req.params.id);
    GetsBy({grupo_id, es_seleccionable: true}).then((services => {
       
        const data = services.map((service) => {
            return <Servicios> ObjectFiltering(service, OUTPUT_TYPES_SERVICIOS);
        })
        
        res.send({success: true, data});

    })).catch(async (error) => {

        res.status(404).send({error: error.message});
        
    })
})

export const GetServiceById = ((_req: Request, res: Response) => {
    res.send('Get Servicios by ID');
})

export const StoreNewService = ( async (req: Request, res: Response) => {
    const data: Servicios = req.body;

    if(ObjectDifferences(data, INPUT_TYPES_SERVICIOS).length > 0){
        return res.status(400).json({message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_SERVICIOS})
    }
    
    Store(data).then((newService) => {
        const data = <Servicios> ObjectFiltering(newService, OUTPUT_TYPES_SERVICIOS);

            return res.send({message: 'Service created successfully!', data});
    
    }).catch(async (error) => {

        if(error.code === 'P2000')
            return res.status(400).send({error: 'A field is too longer.', message: error.message});
        
        return res.status(400).send({error: error.message});
    })
    return
})

export const UpdateService = ((_req: Request, res: Response) => {
    res.send('Update a Servicios');
})

export const DeleteService = ((_req: Request, res: Response) => {
    res.send('Delete a Servicios');
})