import mongoose from 'mongoose';
import Logger from '../lib/logger';

const mongoConnection = () =>
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    })
    .then(() => {
      Logger.success('Conectado ao MongoDB');
    })
    .catch((err) => Logger.error(err));

export default mongoConnection;
