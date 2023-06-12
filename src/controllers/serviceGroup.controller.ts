import { Request, Response } from 'express';
import { GetAll, Store, GetsBy } from '../models/serviceGroup.model';
import { Grupos_servicios } from '@prisma/client';
import { ObjectDifferences, ObjectFiltering } from '../utils/filtering';

/**
    id: number;
    descripcion: string;
    color_hex: string;
 */

const INPUT_TYPES_GRUPOSERVICIOS: string[] = ['descripcion','color_hex'];
const OUTPUT_TYPES_GRUPOSERVICIOS: string[] = ['id','descripcion','color_hex'];

export const GetAllServicesGroup = ((_req: Request, res: Response) => {
    GetAll().then((serviceGroups => {
       
        const data = serviceGroups.map((serviceGroup) => {
            return <Grupos_servicios> ObjectFiltering(serviceGroup, OUTPUT_TYPES_GRUPOSERVICIOS);
        })
        
        return res.send({success: true, data});

    })).catch(async (error) => {
        return res.status(404).send({error: error.message}); 
    })
})

export const GetAllSelectableServicesGroup = ((_req: Request, res: Response) => {
    GetsBy({es_seleccionable: true}).then((serviceGroups) => {
        const data = serviceGroups.map((serviceGroup) => {
            return <Grupos_servicios> ObjectFiltering(serviceGroup, OUTPUT_TYPES_GRUPOSERVICIOS);
        })
        
        return res.send({success: true, data});
    }).catch(async (error) => {
        return res.status(404).send({error: error.message});
    })
})

export const GetServiceGroupById = ((_req: Request, res: Response) => {
    return res.send('Get Grupos Servicios by ID');
})

export const StoreNewServiceGroup = ( async (req: Request, res: Response) => {
    const data: Grupos_servicios = req.body;

    if(ObjectDifferences(data, INPUT_TYPES_GRUPOSERVICIOS).length > 0){
        return res.status(400).json({message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_GRUPOSERVICIOS})
    }
    
    Store(data).then((newServiceGroup) => {
        const data = <Grupos_servicios> ObjectFiltering(newServiceGroup, OUTPUT_TYPES_GRUPOSERVICIOS);

            return res.send({message: 'Service created successfully!', data});
    
    }).catch(async (error) => {

        if(error.code === 'P2000')
            return res.status(400).send({error: 'A field is too longer.', message: error.message});
        
        return res.status(400).send({error: error.message});
    })
    return
})

export const UpdateServiceGroup = ((_req: Request, res: Response) => {
    return res.send('Update a Grupo Servicios');
})

export const DeleteServiceGroup = ((_req: Request, res: Response) => {
    return res.send('Delete a Grupo Servicios');
})