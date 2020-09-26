import 'dotenv/config';
import Logger from './lib/logger';

import app from './app';
import mongoConnection from './database/mongo';

const PORT = process.env.PORT;

mongoConnection();

app.listen(PORT, () => {
  Logger.success(`Conectado na porta ${PORT}`);
});
