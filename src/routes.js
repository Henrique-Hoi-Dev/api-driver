import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import FreightController from './app/controller/FreightController';
import DepositMoneyController from './app/controller/DepositMoneyController';
import TravelExpensesController from './app/controller/TravelExpensesController';
import RestockController from './app/controller/RestockController';
import FinancialStatementsController from './app/controller/FinancialStatementsController';
import NotificationController from './app/controller/NotificationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// cadastro
routes.post('/driver/authenticate', SessionController.sessioDriver);

// autenticação
routes.use(authMiddleware);

// financial statements
routes.put('/driver/financialStatement/:id', FinancialStatementsController.updateFinancialStatements)
      .get('/driver/financialStatement/:id', FinancialStatementsController.getIdFinancialStatements);

// freight
routes.post('/driver/freight', FreightController.createFreight)
      .put('/driver/freight/:id', FreightController.updateFreight)
      .get('/driver/freight/:id', FreightController.getIdFreight)
      .delete('/driver/freight/:id', FreightController.deleteFreight);

// notification
// routes.get('/driver/notifications', NotificationController.getAllNotification);
routes.get('/driver/notifications', NotificationController.getAll);
routes.put('/driver/notification/:id', NotificationController.updateNotification);
routes.put('/driver/notifications/:id', NotificationController.update);


// deposit money
routes.post('/driver/deposit', DepositMoneyController.createDepositMoney)
      .put('/driver/deposit/:id', DepositMoneyController.updateDepositMoney)
      .get('/driver/deposit/:id', DepositMoneyController.getIdDepositMoney)
      .get('/driver/deposits', DepositMoneyController.getAllDepositMoney)
      .delete('/driver/deposit/:id', DepositMoneyController.deleteDepositMoney);

// travel expenses
routes.post('/driver/travel', TravelExpensesController.createTravelExpenses)
      .put('/driver/travel/:id', TravelExpensesController.updateTravelExpenses)
      .get('/driver/travel/:id', TravelExpensesController.getIdTravelExpenses)
      .get('/driver/travels', TravelExpensesController.getAllTravelExpenses)
      .delete('/driver/travel/:id', TravelExpensesController.deleteTravelExpenses);

// restock
routes.post('/driver/restock', RestockController.createRestock)
      .put('/driver/restock/:id', RestockController.updateRestock)
      .get('/driver/restock/:id', RestockController.getIdRestock)
      .get('/driver/restocks', RestockController.getAllRestock)
      .delete('/driver/restock/:id', RestockController.deleteRestock);

export default routes;
