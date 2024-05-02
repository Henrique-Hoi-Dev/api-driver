import express from 'express';
import routes from './routers';
import cors from 'cors';
import sequelize from '../../database/sequelize';

import 'dotenv/config';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.sequelize();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  sequelize() {
    sequelize;
  }
}

export default new App().server;
