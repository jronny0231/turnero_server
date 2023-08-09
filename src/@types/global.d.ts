import { NextFunction } from "express";

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";


export type middlewaresType =
    ((req: any, res: any, next: NextFunction) => any)[]

    

export type DisplayFilterParams = {
    key: UUID,
    where?: Partial<Turnos>,
    match?: {
        param: string,
        field: string,
        values: Array<string>
    } 
}
