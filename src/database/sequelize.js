import Sequelize from 'sequelize';
import User from '../app/models/User';
import "dotenv/config"

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { 
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
});

//check connection (optional)
const models = [ 
  User, 
];

models
.map((model) => model.init(sequelize))
.map(
  (model) => model.associate && model.associate(sequelize.models)
);

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.error("Unable to connect to the database:", err));

export default sequelize;