import express from 'express';
import cors from 'cors';

const App = express();

const PORT = process.env.port || 5000;

App.use(cors({
  origin: 'http://localhost',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

App.listen(PORT, () => {
  console.log('Server Express running on port ' + PORT);
});

export default App;