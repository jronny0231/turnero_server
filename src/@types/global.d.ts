import { NextFunction } from "express";
import { UserPermissions } from "./auth";
import "express";

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

declare global {
    namespace Express {
        interface Request {
            token?: string
            payload?: payloadType
        }
    } 
    interface local {
        super: {
            permissions?: UserPermissions[];
        }
    }
} 


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

export enum SocketEvents {
    CALL_QUEUE = 'call_queue',
    UPDATE_CALL = 'update_call',
    ALTER_QUEUE = 'alter_queue',
    OPEN_AGENT = 'open_agent',
}
