import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import DriverController from './app/controller/DriverController';
import FreightController from './app/controller/FreightController';
import DepositMoneyController from './app/controller/DepositMoneyController';
import TravelExpensesController from './app/controller/TravelExpensesController';
import RestockController from './app/controller/RestockController';
import FinancialStatementsController from './app/controller/FinancialStatementsController';
import NotificationController from './app/controller/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes
  .post('/driver/signin', SessionController.sessioDriver)
  .post('/driver/code-request', DriverController.requestCodeValidation)
  .post('/driver/code-validation', DriverController.validCodeForgotPassword)
  .put('/driver/forgot-password', DriverController.forgotPassword);

routes.use(authMiddleware);

routes
  .get('/driver/profile', DriverController.profile)
  .put('/driver/update-profile', DriverController.update);

routes
  .patch('/driver/financia-statement', FinancialStatementsController.update)
  .get(
    '/driver/financial-statement',
    FinancialStatementsController.getInProgress
  )
  .get(
    '/driver/financial-statements/finished',
    FinancialStatementsController.getAllFinished
  );

// Em processo de frente em aberto
routes
  .post('/driver/freight', FreightController.create)
  .patch('/driver/freight/:id', FreightController.update)
  .post('/driver/freight/starting-trip', FreightController.startingTrip)
  .get('/driver/freight/:id', FreightController.getId)
  .delete('/driver/freight/:id', FreightController.delete);

routes.get('/driver/notifications', NotificationController.getAll);
routes.put('/driver/notifications/:id', NotificationController.update);

routes
  .post('/driver/deposit', DepositMoneyController.create)
  .get('/driver/deposit/:id', DepositMoneyController.getId)
  .get('/driver/deposits', DepositMoneyController.getAll);

routes
  .post('/driver/travel', TravelExpensesController.create)
  .get('/driver/travel/:id', TravelExpensesController.getId)
  .get('/driver/travels', TravelExpensesController.getAll);

routes
  .post('/driver/restock', RestockController.create)
  .get('/driver/restock/:id', RestockController.getId)
  .get('/driver/restocks', RestockController.getAll);

export default routes;
