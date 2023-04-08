import turnosRoute from "./routes/turnos.routes";
import App from "./servers/express.server";

App.use('/api/turnos', turnosRoute)

App.get('/ping', (_req, res) => {
    console.log('Someone ping here!');
    res.send('pong');
})