import App from "./servers/express.server";
import authRoutes from "./routes/auth.routes";
import turnosRoutes from "./routes/turnos.routes";
import userRoutes from "./routes/user.routes";


App.use('/api/auth', authRoutes)
App.use('/api/turnos', turnosRoutes)
App.use('/api/users', userRoutes)
