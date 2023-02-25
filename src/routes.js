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
  .post('/driver/authenticate', SessionController.sessioDriver)
  .put('/driver/forgot-password', DriverController.forgotPassword);

routes.use(authMiddleware);

routes
  .get('/driver/profile', DriverController.profile)
  .put('/driver/update-profile', DriverController.update);

routes
  .put(
    '/driver/financialStatement/:id',
    FinancialStatementsController.updateFinancialStatements
  )
  .get(
    '/driver/financialStatement',
    FinancialStatementsController.getIdFinancialStatements
  )
  .get(
    '/driver/financialStatements/finished',
    FinancialStatementsController.getAllFinancialStatementsFinished
  );

routes
  .post('/driver/freight', FreightController.createFreight)
  .put('/driver/freight/:id', FreightController.updateFreight)
  .get('/driver/freight/:id', FreightController.getIdFreight)
  .delete('/driver/freight/:id', FreightController.deleteFreight);

routes.get('/driver/notifications', NotificationController.getAll);
routes.put('/driver/notifications/:id', NotificationController.update);

routes
  .post('/driver/deposit', DepositMoneyController.createDepositMoney)
  .get('/driver/deposit/:id', DepositMoneyController.getIdDepositMoney)
  .get('/driver/deposits', DepositMoneyController.getAllDepositMoney);

routes
  .post('/driver/travel', TravelExpensesController.createTravelExpenses)
  .get('/driver/travel/:id', TravelExpensesController.getIdTravelExpenses)
  .get('/driver/travels', TravelExpensesController.getAllTravelExpenses);

routes
  .post('/driver/restock', RestockController.createRestock)
  .get('/driver/restock/:id', RestockController.getIdRestock)
  .get('/driver/restocks', RestockController.getAllRestock);

export default routes;
