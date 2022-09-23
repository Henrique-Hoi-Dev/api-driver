import Sequelize, { Model } from 'sequelize';

class Cart extends Model {
  static init(sequelize) {
    super.init(
      {
        cart_models: Sequelize.STRING,
        cart_brand: Sequelize.STRING,
        cart_tara: Sequelize.STRING,
        cart_color: Sequelize.STRING,
        cart_bodywork: Sequelize.ENUM(
          { 
            values: ['tank', 'bulkCarrier', 'sider', 'chest']
          }
        ),
        cart_year: Sequelize.STRING,
        cart_chassis: Sequelize.DOUBLE,
        cart_liter_capacity: Sequelize.DOUBLE,
        cart_ton_capacity: Sequelize.DOUBLE,
        cart_board: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.FinancialStatements, { foreignKey: 'cart_id', as: 'financialStatements' });  
  }
}

export default Cart;
