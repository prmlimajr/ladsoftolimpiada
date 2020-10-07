import 'dotenv/config';
import Logger from './lib/logger';
import cors from 'cors';

import app from './app';

const PORT = process.env.PORT || 3333;

app.use(cors());

app.listen(PORT, () => {
  Logger.success(`Conectado na porta ${PORT}`);
});
