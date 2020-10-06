import 'dotenv/config';
import Logger from './lib/logger';

import app from './app';

const PORT = process.env.PORT;

app.listen(PORT, () => {
  Logger.success(`Conectado na porta ${PORT}`);
});
