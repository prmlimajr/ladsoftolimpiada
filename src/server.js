import 'dotenv/config';
import Logger from './lib/logger';
import cors from 'cors';

import app from './app';

const PORT = process.env.PORT || 3333;

app.use(cors());

app.use(function (req, res, next) {
  res.header(
    'Access-Control-Allow-Origin',
    'https://ladsoft-olimpiada.herokuapp.com/'
  );
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.listen(PORT, () => {
  Logger.success(`Conectado na porta ${PORT}`);
});
