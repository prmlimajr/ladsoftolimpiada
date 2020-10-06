import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ScoreBoardController from './app/controllers/ScoreBoardController';
import ChallengeController from './app/controllers/ChallengeController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.get('/ranking', UserController.listRanking);
routes.put('/users', UserController.update);

routes.get('/score', ScoreBoardController.list);
routes.get('/score/:id', ScoreBoardController.listOne);
routes.post('/answer/:id', ScoreBoardController.answer);

routes.get('/challenges', ChallengeController.list);

export default routes;
