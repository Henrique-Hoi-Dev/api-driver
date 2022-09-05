import Sequelize, { Model } from 'sequelize';

class Truck extends Model {
  static init(sequelize) {
    super.init(
      {
        truck_models: Sequelize.STRING,
        truck_board: Sequelize.STRING,
        truck_km: Sequelize.STRING,
        truck_year: Sequelize.DATEONLY,
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

export default Truck;
