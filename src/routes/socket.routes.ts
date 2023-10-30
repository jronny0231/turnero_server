import { socketToken } from '../middlewares/activeToken.middlewares';
import server, { SocketType } from '../servers/socket.server';

server.use(socketToken)

enum SOCKET_URIS {
    AGENTS = "/agents",
    DISPLAY = "/display",
    DASHBOARD = "/dashboard"
}

server.on('connection', (client: SocketType) => {

    client.on('connect_error', (err) => {
        console.error('Error trying to connect to socket', err.message)
    })

    console.log('Client conected')

    client.emit('routes', SOCKET_URIS)
})

export default server