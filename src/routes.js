import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import UserController from './app/controller/UserController';
import DriverController from './app/controller/DriverController';
import TruckController from './app/controller/TruckController';
import FreightController from './app/controller/FreightController';
import FinancialStatementsController from './app/controller/FinancialStatementsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// cadastro
routes.post('/user/register', UserController.createUser);
routes.post('/user/authenticate', SessionController.sessionUser);
routes.post('/driver/register', DriverController.createDriver)
routes.post('/driver/authenticate', SessionController.sessioDriver);

// autenticação
routes.use(authMiddleware);

// users
routes.put('/user/:id', UserController.updateUser)
      .get('/user/:id', UserController.getIdUser)
      .get('/users', UserController.getAllUser)
      .delete('/user/:id', UserController.deleteUser);

// users driver
routes.put('/driver/:id', DriverController.updateDriver)
      .get('/driver/:id', DriverController.getIdDriver)
      .get('/drivers', DriverController.getAllDriver)
      .delete('/driver/:id', DriverController.deleteDriver);

// trucks
routes.post('/truck', TruckController.createTruck)
      .put('/truck/:id', TruckController.updateTruck)
      .get('/truck/:id', TruckController.getIdTruck)
      .get('/trucks', TruckController.getAllTruck)
      .delete('/truck/:id', TruckController.deleteTruck);

// financial statements
routes.post('/financialStatement', FinancialStatementsController.createFinancialStatements)
      .put('/financialStatement/:id', FinancialStatementsController.updateFinancialStatements)
      .get('/financialStatement/:id', FinancialStatementsController.getIdFinancialStatements)
      .get('/financialStatements', FinancialStatementsController.getAllFinancialStatements)
      .delete('/financialStatement/:id', FinancialStatementsController.deleteFinancialStatements);

// freight
routes.post('/freight', FreightController.createFreight)
      .put('/freight/:id', FreightController.updateFreight)
      .get('/freight/:id', FreightController.getIdFreight)
      .get('/freights', FreightController.getAllFreight)
      .delete('/freight/:id', FreightController.deleteFreight);

export default routes;
