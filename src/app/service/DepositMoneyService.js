import DepositMoney from '../models/DepositMoney';
import FinancialStatements from '../models/FinancialStatements';
import Freight from '../models/Freight';
import Driver from '../models/Driver';

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export default {
  async create(user, body) {
    const { freight_id } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: user.id, status: true },
    });
    if (!financial) throw new CustomError('FINANCIAL_NOT_FOUND', 404);

    const freight = await Freight.findByPk(freight_id);

    if (!freight) throw new CustomError('FREIGHT_NOT_FOUND', 404);

    if (freight.status === 'STARTING_TRIP') {
      const result = await DepositMoney.create({
        ...body,
        financial_statements_id: financial.id,
      });

      const driverFind = await Driver.findByPk(user.id);
      driverFind.addTransaction({
        value: result.value,
        typeTransactions: result.type_transaction,
      });

      const driver = await Driver.findByPk(driverFind.id);
      const values = driverFind.transactions.map((res) => res.value);
      const total = values.reduce((acc, cur) => acc + cur, 0);

      await driver.update({
        transactions: driverFind.transactions,
        credit: total,
      });

      return { data: result };
    }

    throw new CustomError('This front is not traveling', 404);
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 10,
      sort_order = 'ASC',
      sort_field = 'id',
    } = query;

    const totalItems = (await DepositMoney.findAll()).length;

    const totalPages = Math.ceil(totalItems / limit);

    const depositMoney = await DepositMoney.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
    });

    const currentPage = Number(page);

    return {
      data: depositMoney,
      totalItems,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const depositMoney = await DepositMoney.findByPk(id, {});

    if (!depositMoney) throw Error('DEPOSIT_NOT_FOUND');

    return { data: depositMoney };
  },
};
