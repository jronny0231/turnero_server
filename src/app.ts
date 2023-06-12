import App from "./servers/express.server";
import WSS from "./servers/ws.server";
import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routes";
import userRoutes from "./routes/user.routes";
import serviceRoutes from "./routes/service.routes";

const appVersion: number = 1;

App.use(`/api/v${appVersion}/auth`, authRoutes)
App.use(`/api/v${appVersion}/queues`, queueRoutes)
App.use(`/api/v${appVersion}/users`, userRoutes)
App.use(`/api/v${appVersion}/services`, serviceRoutes)

WSS.on('connection', function connection(ws) {
    ws.send(`Connected to server`);
});

export default App;