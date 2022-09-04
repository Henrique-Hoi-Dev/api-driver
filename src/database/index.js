import Sequelize from 'sequelize';
import User from '../app/models/User';

import databaseConfig from '../config/database.js';

const models = [ 
  User, 
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
