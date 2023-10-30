import App from './express.server';
import { Server, Socket } from 'socket.io'
import http from 'http';

const SOCKET_PORT: number  = Number(process.env.SOCKET_PORT ?? 5050);
// Initialize socket.io server
const server = http.createServer(App)
const io = new Server(server, {
    cors: {
        origin: ["*"],
        methods: ["GET", "POST", "PUT"]
    }
});

server.listen(SOCKET_PORT, () => {
    console.log(`Socket server listening on port ${SOCKET_PORT}`)
})

export default io
export { Socket as SocketType}