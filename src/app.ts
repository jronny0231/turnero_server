import App from "./servers/express.server";
import wss from "./servers/ws.server";
import authRoutes from "./routes/auth.routes";
import configRoutes from "./routes/config.routes";
import queueRoutes from "./routes/queue.routes";
import userRoutes from "./routes/user.routes";
import serviceRoutes from "./routes/service.routes";
import agentRoutes from "./routes/agent.routes";
import audioRoutes from "./routes/records.routes";
import officeRoutes from "./routes/office.routes";
import departmentRoutes from "./routes/department.routes";
import awsRoutes from "./routes/aws.routes";

wss.on("connection", () => {})

const pjson = require("../package.json");

const version: string = "1" || pjson.version;

App.use(`/api/v${version}/auth`, authRoutes)
App.use(`/api/v${version}/config`, configRoutes)
App.use(`/api/v${version}/queues`, queueRoutes)
App.use(`/api/v${version}/users`, userRoutes)
App.use(`/api/v${version}/services`, serviceRoutes)
App.use(`/api/v${version}/agents`, agentRoutes)
App.use(`/api/v${version}/audio`, audioRoutes)
App.use(`/api/v${version}/offices`, officeRoutes)
App.use(`/api/v${version}/departments`, departmentRoutes)
App.use(`/api/v${version}/aws`, awsRoutes)

export default App;