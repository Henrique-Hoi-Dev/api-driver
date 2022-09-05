import Sequelize from 'sequelize';
import User from '../app/models/User';
import Driver from '../app/models/Driver';
import Truck from '../app/models/Truck';
import FinancialStatements from '../app/models/FinancialStatements';

import databaseConfig from '../config/database.js';

const models = [ 
  User,
  Driver,
  Truck,
  FinancialStatements,
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
