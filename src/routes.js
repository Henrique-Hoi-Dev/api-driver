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
routes.put('/financialStatement/:id', FinancialStatementsController.updateFinancialStatements)
      .get('/financialStatement/:id', FinancialStatementsController.getIdFinancialStatements);

// freight
routes.post('/freight', FreightController.createFreight)
      .put('/freight/:id', FreightController.updateFreight)
      .get('/freight/:id', FreightController.getIdFreight)
      .get('/freights', FreightController.getAllFreight)
      .delete('/freight/:id', FreightController.deleteFreight);

// notification
routes.get('/notifications', NotificationController.getAllNotification);
routes.get('/notificationss', NotificationController.getAll);
routes.put('/notification/:id', NotificationController.updateNotification);
routes.put('/notifications/:id', NotificationController.update);


// deposit money
routes.post('/deposit', DepositMoneyController.createDepositMoney)
      .put('/deposit/:id', DepositMoneyController.updateDepositMoney)
      .get('/deposit/:id', DepositMoneyController.getIdDepositMoney)
      .get('/deposits', DepositMoneyController.getAllDepositMoney)
      .delete('/deposit/:id', DepositMoneyController.deleteDepositMoney);

// travel expenses
routes.post('/travel', TravelExpensesController.createTravelExpenses)
      .put('/travel/:id', TravelExpensesController.updateTravelExpenses)
      .get('/travel/:id', TravelExpensesController.getIdTravelExpenses)
      .get('/travels', TravelExpensesController.getAllTravelExpenses)
      .delete('/travel/:id', TravelExpensesController.deleteTravelExpenses);

// restock
routes.post('/restock', RestockController.createRestock)
      .put('/restock/:id', RestockController.updateRestock)
      .get('/restock/:id', RestockController.getIdRestock)
      .get('/restocks', RestockController.getAllRestock)
      .delete('/restock/:id', RestockController.deleteRestock);

export default routes;
