import express from 'express';
import cors from 'cors';

const App = express();

const PORT: number = Number(process.env.PORT) || 5000;

App.use(cors({
  origin: '*',
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

App.use(express.json());
App.use(express.static(__dirname + '/public'));

App.listen(PORT, () => {
  console.log('Server Express running on port ' + PORT);
});

App.get('/ping', (_req, res) => {
  console.log('Someone ping here!');
  res.send('pong');
})

export default App;