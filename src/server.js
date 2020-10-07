import 'dotenv/config';
import Logger from './lib/logger';

import app from './app';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  Logger.success(`Conectado na porta ${PORT}`);
});
