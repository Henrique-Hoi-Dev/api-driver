import Sequelize, { Model } from 'sequelize';

class FinancialStatements extends Model {
  static init(sequelize) {
    super.init(
      {
        driver_id: Sequelize.INTEGER,
        truck_id: Sequelize.INTEGER,
        driver_name: Sequelize.STRING,
        invoicing: Sequelize.DOUBLE,
        start_trip: Sequelize.DATEONLY,
        medium_fuel: Sequelize.DOUBLE,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  // static associate(models) {
  //   this.hasOne(models.Adress, { foreignKey: 'user_id', as: 'adress' });
  //   this.hasMany(models.FinancialBox, { foreignKey: 'user_id', as: 'financialBox' });
  //   this.hasMany(models.Order, { foreignKey: 'seller_id', as: 'order' });
  // }
}

export default FinancialStatements;
