import Sequelize, { Model } from 'sequelize';

class Truck extends Model {
  static init(sequelize) {
    super.init(
      {
        truck_models: Sequelize.STRING,
        truck_board: Sequelize.STRING,
        truck_km: Sequelize.DOUBLE,
        truck_year: Sequelize.STRING,
        truck_avatar: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.FinancialStatements, { foreignKey: 'truck_id', as: 'financialStatements' });
  }
}

export default Truck;
