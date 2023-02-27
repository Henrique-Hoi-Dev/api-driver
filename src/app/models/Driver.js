import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Driver extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        name_user: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        status: {
          type: Sequelize.ENUM,
          values: ['ACTIVE', 'INACTIVE', 'INCOMPLETE'],
          defaultValue: 'INCOMPLETE',
        },
        type_positions: {
          type: Sequelize.STRING,
          defaultValue: 'COLLABORATOR',
        },
        permission_id: Sequelize.INTEGER,
        // driver personal data
        cpf: Sequelize.STRING,
        number_cnh: Sequelize.STRING,
        valid_cnh: Sequelize.DATEONLY,
        date_valid_mopp: Sequelize.DATEONLY,
        date_valid_nr20: Sequelize.DATEONLY,
        date_valid_nr35: Sequelize.DATEONLY,
        date_admission: Sequelize.DATEONLY,
        date_birthday: Sequelize.DATEONLY,
        // walking data
        cart: Sequelize.STRING,
        truck: Sequelize.STRING,
        // financial data
        credit: Sequelize.DECIMAL,
        value_fix: Sequelize.DECIMAL,
        percentage: Sequelize.DECIMAL,
        daily: Sequelize.DECIMAL,
      },
      {
        sequelize,
        timestamps: true,
      }
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.FinancialStatements, {
      foreignKey: 'driver_id',
      as: 'financialStatements',
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Driver;
