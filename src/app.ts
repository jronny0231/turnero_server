import App from "./servers/express.server";
import authRoutes from "./routes/auth.routes";
import queueRoutes from "./routes/queue.routes";
import userRoutes from "./routes/user.routes";
import serviceRoutes from "./routes/service.routes";


App.use('/api/auth', authRoutes)
App.use('/api/queues', queueRoutes)
App.use('/api/users', userRoutes)
App.use('/api/services', serviceRoutes)




export default App;