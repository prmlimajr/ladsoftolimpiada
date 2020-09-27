import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ScoreBoardController from './app/controllers/ScoreBoardController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.get('/score', ScoreBoardController.list);
routes.post('/score/:id', ScoreBoardController.store);

// routes.get('/notifications', NotificationController.index);
// routes.put('/notifications/:id', NotificationController.update);

export default routes;
