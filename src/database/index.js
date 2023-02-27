import Sequelize from 'sequelize';

import Driver from '../app/models/Driver';
import User from '../app/models/User';
import Cart from '../app/models/Cart';
import Truck from '../app/models/Truck';
import Freight from '../app/models/Freight';
import Restock from '../app/models/Restock';
import TravelExpenses from '../app/models/TravelExpenses';
import DepositMoney from '../app/models/DepositMoney';
import Notification from '../app/models/Notification';
import FinancialStatements from '../app/models/FinancialStatements';

import databaseConfig from '../config/database.js';

const models = [
  Cart,
  User,
  Truck,
  Driver,
  Freight,
  DepositMoney,
  Notification,
  FinancialStatements,
  TravelExpenses,
  Restock,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connetion = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connetion))
      .map(
        (model) => model.associate && model.associate(this.connetion.models)
      );
  }
}

export default new Database();
