import Sequelize, { Model } from 'sequelize';

class Restock extends Model {
  static init(sequelize) {
    super.init(
      {
        financial_statements_id: Sequelize.INTEGER,
        name_establishment: Sequelize.STRING,
        city: Sequelize.STRING,
        date: Sequelize.DATEONLY,
        value: Sequelize.DOUBLE,
        proof_img: Sequelize.STRING,
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.FinancialStatements, { foreignKey: 'financial_statements_id', as: 'financialStatements' });
  }
}

export default Restock;
