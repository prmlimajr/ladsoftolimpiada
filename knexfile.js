const path = require('path');

module.exports = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ladsoftolimpiada',
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
  },
  useNullAsDefault: true,
};
