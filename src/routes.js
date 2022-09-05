import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import UserController from './app/controller/UserController';
import DriverController from './app/controller/DriverController';
import TruckController from './app/controller/TruckController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// cadastro
routes.post('/user/register', UserController.createUser);
routes.post('/user/authenticate', SessionController.sessionUser);

// autenticação
routes.use(authMiddleware);

// users
routes.put('/user/:id', UserController.updateUser)
      .get('/user/:id', UserController.getIdUser)
      .get('/users', UserController.getAllUser)
      .delete('/user/:id', UserController.deleteUser);

// users driver
routes.post('/driver', DriverController.createDriver)
      .put('/driver/:id', DriverController.updateDriver)
      .get('/driver/:id', DriverController.getIdDriver)
      .get('/drivers', DriverController.getAllDriver)
      .delete('/driver/:id', DriverController.deleteDriver);

// trucks
routes.post('/truck', TruckController.createTruck)
      .put('/truck/:id', TruckController.updateTruck)
      .get('/truck/:id', TruckController.getIdTruck)
      .get('/trucks', TruckController.getAllTruck)
      .delete('/truck/:id', TruckController.deleteTruck);


export default routes;
