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
import Credit from '../app/models/Credit';
import ValidateCode from '../app/models/ValidateCode.js';
import Cities from '../app/models/Cities.js';
import States from '../app/models/States.js';

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
  Credit,
  Cities,
  States,
  ValidateCode,
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
