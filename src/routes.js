import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import UserController from './app/controller/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// cadastro
routes.post('/user/register', UserController.createUser);
routes.post('/user/authenticate', SessionController.sessionUser);

// autenticação
// routes.use(authMiddleware);

// users
routes.put('/user/:id', UserController.updateUser)
      .get('/user/:id', UserController.getIdUser)
      .get('/users', UserController.getAllUser)
      .delete('/user/:id', UserController.deleteUser);


export default routes;
