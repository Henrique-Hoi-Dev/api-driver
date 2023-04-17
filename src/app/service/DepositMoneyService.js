import DepositMoney from '../models/DepositMoney';
import FinancialStatements from '../models/FinancialStatements';
import Freight from '../models/Freight';
import Driver from '../models/Driver';

export default {
  async create(user, body) {
    const { freight_id } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: user.id, status: true },
    });
    if (!financial) throw Error('Financial statements not found');

    const freight = await Freight.findByPk(freight_id);

    if (!freight) throw Error('Freight not found');

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

      return result;
    }

    return { msg: 'This front is not traveling' };
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = query;

    const total = (await DepositMoney.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const depositMoney = await DepositMoney.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'type_transaction',
        'local',
        'type_bank',
        'value',
        'proof_img',
      ],
    });

    const currentPage = Number(page);

    return {
      dataResult: depositMoney,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const depositMoney = await DepositMoney.findByPk(id, {
      attributes: [
        'id',
        'type_transaction',
        'local',
        'type_bank',
        'value',
        'proof_img',
      ],
    });

    if (!depositMoney) throw Error('Deposit Money not found');

    return { dataResult: depositMoney };
  },
};
