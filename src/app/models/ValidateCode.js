import Sequelize, { Model } from 'sequelize';

class ValidateCode extends Model {
  static init(sequelize) {
    super.init(
      {
        cpf: { type: Sequelize.STRING },
        expiration_date: {
          type: Sequelize.DATE,
        },
        code: { type: Sequelize.STRING, unique: true },
        status: {
          type: Sequelize.ENUM({
            values: ['AVAILABLE', 'EXPIRED', 'USED'],
          }),
          defaultValue: 'AVAILABLE',
        },
      },
      {
        sequelize,
        timestamps: true,
      }
    );
    return this;
  }
}

export default ValidateCode;
