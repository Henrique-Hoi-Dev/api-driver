import Sequelize, { Model } from 'sequelize';

class FinancialStatements extends Model {
  static init(sequelize) {
    super.init(
      {
        driver_id: Sequelize.INTEGER,
        truck_id: Sequelize.INTEGER,
        start_km: Sequelize.DOUBLE,
        final_km: Sequelize.DOUBLE,
        start_date: Sequelize.DATEONLY,
        final_date: Sequelize.DATEONLY,
        driver_name: Sequelize.STRING,
        truck_models: Sequelize.STRING,
        truck_avatar: Sequelize.STRING,
        truck_board: Sequelize.STRING,
        invoicing_all: Sequelize.DOUBLE,
        medium_fuel_all: Sequelize.DOUBLE,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Driver, { foreignKey: 'driver_id', as: 'driver' });
    this.belongsTo(models.Truck, { foreignKey: 'truck_id', as: 'truck' });
    this.hasMany(models.Freight, { foreignKey: 'financial_statements_id', as: 'financialStatements' });
  }
}

export default FinancialStatements;
