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
import ValidateCode from '../app/models/ValidateCode';
import Cities from '../app/models/Cities.js';
import States from '../app/models/States.js';

import 'dotenv/config';

const sequelize = new Sequelize(process.env.DATABASE_URL_HER, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
});

// check connection (optional)
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

models
  .map((model) => model.init(sequelize))
  .map((model) => model.associate && model.associate(sequelize.models));

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

export default sequelize;
