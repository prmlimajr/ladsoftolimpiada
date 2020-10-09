const Router = require('express').Router;

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const ScoreBoardController = require('./app/controllers/ScoreBoardController');
const ChallengeController = require('./app/controllers/ChallengeController');

const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.get('/ranking', UserController.listRanking);
routes.put('/users', UserController.update);

routes.get('/score', ScoreBoardController.list);
routes.get('/points', ScoreBoardController.listPoints);
routes.get('/score/:id', ScoreBoardController.listOne);
routes.post('/answer/:id', ScoreBoardController.answer);

routes.get('/challenges', ChallengeController.list);

module.exports = routes;
