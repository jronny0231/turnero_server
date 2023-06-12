import { Pantallas } from '@prisma/client';
import { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { GetAll } from '../models/display.model';

const PORT: number = Number(process.env.WS_PORT) || 5050;

const WSS = new WebSocketServer({ port: PORT });


// Check SmartTV connection path and secret key

const clientUUID = new Map<string, Partial<Pantallas> >();

const fetchPantallas = async (): Promise<(Pantallas)[]> => {
    return await GetAll()
}

const webSocketMiddleware = (ws: WebSocket, req: IncomingMessage, cb: (socket: WebSocket, request: IncomingMessage) => void) => {
    if(req.url){

        const UUID = req.url.replace('/', '');
        fetchPantallas().then(pantallas => {
            let found = false;
            pantallas.forEach(pantalla => {
                if(pantalla.key === UUID){
                    found = true;
                    clientUUID.set(UUID, pantalla)
                    cb(ws, req);
                    return;
                }
            })
            !found && ws.close(3001, 'UUID not matched');
        }).catch(error => {
            ws.close(3001, error.message)
            return;
        })    
    } else {
        ws.close(4001, "No UUID provided")
        return;
    }
}

const onClose = (UUID: string, code: number, reason: Buffer) => {
    console.log(`Client disconnected, code: ${code}, reason: ${reason}`);

    const hasDeleted: boolean = clientUUID.delete(UUID);
    if(hasDeleted){
        console.log('Client deleted');
    }
    else{
        console.log('Client not found');
    }
}

WSS.on('connection',  (socket: WebSocket, request: IncomingMessage) => {
    webSocketMiddleware(socket, request, (ws: WebSocket, req: IncomingMessage) => {
        
        ws.on('close', (code, reason) => {
            if(req.url){
                const UUID = req.url.replace('/', '');
                onClose(UUID, code, reason);
            }
        });

        ws.on('message', (msg: IncomingMessage) => {
            console.log('received: %s', msg);
            ws.send('You`ve send: ' + msg)
        });

        ws.on('error', (error: Error) => {
            console.error({socketError: error});
        });
    }); 
});

export default WSS;
