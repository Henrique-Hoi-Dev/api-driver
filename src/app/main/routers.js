import { Router } from 'express';

import SessionController from '../controller/SessionController';
import DriverController from '../controller/DriverController';
import FreightController from '../controller/FreightController';
import DepositMoneyController from '../controller/DepositMoneyController';
import TravelExpensesController from '../controller/TravelExpensesController';
import RestockController from '../controller/RestockController';
import FinancialStatementsController from '../controller/FinancialStatementsController';
import NotificationController from '../controller/NotificationController';

import authMiddleware from '../middlewares/auth';
import multer from 'multer';

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
  .patch('/driver/financia', FinancialStatementsController.update)
  .get(
    '/driver/financial/current',
    FinancialStatementsController.getFinancialCurrent
  )
  .get(
    '/driver/financial/finisheds',
    FinancialStatementsController.getAllFinished
  );

routes
  .post('/driver/freight', FreightController.create)
  .patch('/driver/freight/:id', FreightController.update)
  .post('/driver/freight/starting-trip', FreightController.startingTrip)
  .post('/driver/freight/finished-trip', FreightController.finishedTrip)
  .patch(
    '/driver/freight/upload-documents/:id',
    multer().single('file'),
    FreightController.uploadDocuments
  )
  .get('/driver/freight/search-documents', FreightController.getDocuments)
  .patch('/driver/freight/delete-documents/:id', FreightController.deleteFile)
  .get('/driver/freight/:id', FreightController.getId)
  .delete('/driver/freight/:id', FreightController.delete);

routes
  .post('/driver/deposit', DepositMoneyController.create)
  .get('/driver/deposit/:id', DepositMoneyController.getId)
  .patch(
    '/driver/deposit/upload-documents/:id',
    multer().single('file'),
    DepositMoneyController.uploadDocuments
  )
  .delete(
    '/driver/deposit/delete-documents/:id',
    DepositMoneyController.deleteFile
  )
  .get('/driver/deposits', DepositMoneyController.getAll);

routes
  .post('/driver/travel', TravelExpensesController.create)
  .get('/driver/travel/:id', TravelExpensesController.getId)
  .patch(
    '/driver/travel/upload-documents/:id',
    multer().single('file'),
    TravelExpensesController.uploadDocuments
  )
  .delete(
    '/driver/travel/delete-documents/:id',
    TravelExpensesController.deleteFile
  )
  .get('/driver/travels', TravelExpensesController.getAll);

routes
  .post('/driver/restock', RestockController.create)
  .get('/driver/restock/:id', RestockController.getId)
  .patch(
    '/driver/restock/upload-documents/:id',
    multer().single('file'),
    RestockController.uploadDocuments
  )
  .delete('/driver/restock/delete-documents/:id', RestockController.deleteFile)
  .get('/driver/restocks', RestockController.getAll);

routes.get('/driver/notifications', NotificationController.getAll);
routes.put('/driver/notifications/:id', NotificationController.update);

export default routes;
