import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path'
import morganMiddleware from '../middlewares/expressLogger.middlewares';
import logger from '../utils/logger';

const App = express();

const PORT: number = Number(process.env.PORT ?? 5000);

App.use(cors({
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));


// Express Middleware settings
App.use(express.json());
App.use(express.urlencoded({ extended: false }))
App.use(express.static(path.resolve('./public')));
App.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/upload/'
}));
const wistonStream = {
  // Use the http severity for Morgan logs
  write: (message: any) => logger.http(message),
};
App.use(morganMiddleware(wistonStream))


App.listen(PORT, () => {
  console.log('Server Express running on port ' + PORT);
});


App.get('/ping', (_req, res) => {
  console.log('Someone ping here!');
  res.send('pong');
})

export default App
