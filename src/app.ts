import App from "./servers/express.server";
import authRoutes from "./routes/auth.routes";
import configRoutes from "./routes/config.routes";
import queueRoutes from "./routes/queue.routes";
import userRoutes from "./routes/user.routes";
import serviceRoutes from "./routes/service.routes";
import agentRoutes from "./routes/agent.routes";
import audioRoutes from "./routes/records.routes";

const version: string = process.env.VERSION || "1";

App.use(`/api/v${version}/auth`, authRoutes)
App.use(`/api/v${version}/config`, configRoutes)
App.use(`/api/v${version}/queues`, queueRoutes)
App.use(`/api/v${version}/users`, userRoutes)
App.use(`/api/v${version}/services`, serviceRoutes)
App.use(`/api/v${version}/agents`, agentRoutes)
App.use(`/api/v${version}/audio`, audioRoutes)

export default App;