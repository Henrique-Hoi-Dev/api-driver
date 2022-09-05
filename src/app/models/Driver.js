import Sequelize, { Model } from 'sequelize';

class Driver extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        set: Sequelize.STRING,
        number_cnh: Sequelize.STRING,
        valid_cnh: Sequelize.STRING,
        valid_mopp: Sequelize.STRING,
        cpf: Sequelize.STRING,
        date_admission: Sequelize.DATEONLY,
        date_birthday: Sequelize.DATEONLY,
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

export default Driver;
