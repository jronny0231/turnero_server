import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import { config } from 'dotenv';


const App = express();

// Load application configuration from configuration .env file
config()

const PORT: number = Number(process.env.PORT ?? 0);

if(PORT === 0) {
  console.error({message: "Port number not set"})
  process.abort()
}

App.use(cors({
  origin: '*',
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

App.listen(PORT, () => {
  console.log('Server Express running on port ' + PORT);
});

App.get('/ping', (_req, res) => {
  console.log('Someone ping here!');
  res.send('pong');
})

export default App;
