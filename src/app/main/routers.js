import { Router } from 'express';

import SessionController from '../controller/SessionController';
import DriverController from '../controller/DriverController';
import FreightController from '../controller/FreightController';
import DepositMoneyController from '../controller/DepositMoneyController';
import TravelExpensesController from '../controller/TravelExpensesController';
import RestockController from '../controller/RestockController';
import FinancialStatementsController from '../controller/FinancialStatementsController';
import NotificationController from '../controller/NotificationController';
import CitiesController from '../controller/CitiesController';
import StatesController from '../controller/StatesController';

import authMiddleware from '../middlewares/auth';
import multer from 'multer';

const routes = new Router();

routes
  .post('/driver/signin', SessionController.sessioDriver)
  .post('/driver/code-request', DriverController.requestCodeValidation)
  .post('/driver/code-validation', DriverController.validCodeForgotPassword);

routes
  .get('/driver/profile', authMiddleware, DriverController.profile)
  .put('/driver/update-profile', authMiddleware, DriverController.update)
  .put(
    '/driver/forgot-password',
    authMiddleware,
    DriverController.forgotPassword
  );

routes
  .patch(
    '/driver/financia',
    authMiddleware,
    FinancialStatementsController.update
  )
  .get(
    '/driver/financial/current',
    authMiddleware,
    FinancialStatementsController.getFinancialCurrent
  )
  .get(
    '/driver/financial/finisheds',
    authMiddleware,
    FinancialStatementsController.getAllFinished
  );

routes
  .post('/driver/freight', authMiddleware, FreightController.create)
  .patch('/driver/freight/:id', authMiddleware, FreightController.update)
  .post(
    '/driver/freight/starting-trip',
    authMiddleware,
    FreightController.startingTrip
  )
  .post(
    '/driver/freight/finished-trip',
    authMiddleware,
    FreightController.finishedTrip
  )
  .patch(
    '/driver/freight/upload-documents/:id',
    multer().single('file'),
    authMiddleware,
    FreightController.uploadDocuments
  )
  .get(
    '/driver/freight/search-documents',
    authMiddleware,
    FreightController.getDocuments
  )
  .patch(
    '/driver/freight/delete-documents/:id',
    authMiddleware,
    FreightController.deleteFile
  )
  .get(
    '/driver/freight/:id',
    authMiddleware,
    authMiddleware,
    FreightController.getId
  )
  .delete('/driver/freight/:id', authMiddleware, FreightController.delete);

routes
  .post('/driver/deposit', authMiddleware, DepositMoneyController.create)
  .get('/driver/deposit/:id', authMiddleware, DepositMoneyController.getId)
  .patch(
    '/driver/deposit/upload-documents/:id',
    multer().single('file'),
    authMiddleware,
    DepositMoneyController.uploadDocuments
  )
  .delete(
    '/driver/deposit/delete-documents/:id',
    authMiddleware,
    DepositMoneyController.deleteFile
  )
  .get('/driver/deposits', authMiddleware, DepositMoneyController.getAll);

routes
  .post('/driver/travel', authMiddleware, TravelExpensesController.create)
  .get('/driver/travel/:id', authMiddleware, TravelExpensesController.getId)
  .patch(
    '/driver/travel/upload-documents/:id',
    multer().single('file'),
    authMiddleware,
    TravelExpensesController.uploadDocuments
  )
  .delete(
    '/driver/travel/delete-documents/:id',
    authMiddleware,
    TravelExpensesController.deleteFile
  )
  .get('/driver/travels', authMiddleware, TravelExpensesController.getAll);

routes
  .post('/driver/restock', authMiddleware, RestockController.create)
  .get('/driver/restock/:id', authMiddleware, RestockController.getId)
  .patch(
    '/driver/restock/upload-documents/:id',
    multer().single('file'),
    authMiddleware,
    RestockController.uploadDocuments
  )
  .delete(
    '/driver/restock/delete-documents/:id',
    authMiddleware,
    RestockController.deleteFile
  )
  .get('/driver/restocks', authMiddleware, RestockController.getAll);

routes.patch(
  '/driver/activate/receive-notifications',
  authMiddleware,
  NotificationController.activateReceiveNotifications
);

routes.get(
  '/driver/notifications',
  authMiddleware,
  NotificationController.getAll
);
routes.put(
  '/driver/notifications/:id',
  authMiddleware,
  NotificationController.update
);
routes.post(
  '/driver/notifications/allread',
  authMiddleware,
  NotificationController.markAllRead
);

routes.get('/citis', authMiddleware, CitiesController.allCities);
routes.get('/states', authMiddleware, StatesController.allStates);
routes.post(
  '/popular-city-state',
  multer().single('file'),
  authMiddleware,
  StatesController.popularCityStateData
);

export default routes;
