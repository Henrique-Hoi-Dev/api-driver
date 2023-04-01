import TravelExpenses from '../models/TravelExpenses';
import FinancialStatements from '../models/FinancialStatements';
import Freight from '../models/Freight';

export default {
  async create(driverId, body) {
    let { freight_id } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financial) throw Error('Financial statements not found');

    const freight = await Freight.findByPk(freight_id);
    if (!freight) throw Error('Freight not found');

    if (freight.status === 'STARTING_TRIP') {
      const result = await TravelExpenses.create({
        ...body,
        financial_statements_id: financial.id,
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

    const total = (await TravelExpenses.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const travelExpenses = await TravelExpenses.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'type_establishment',
        'name_establishment',
        'expense_description',
        'value',
        'proof_img',
      ],
    });

    const currentPage = Number(page);

    return {
      dataResult: travelExpenses,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const travelExpense = await TravelExpenses.findByPk(id, {
      attributes: [
        'id',
        'type_establishment',
        'name_establishment',
        'expense_description',
        'value',
        'proof_img',
      ],
    });

    if (!travelExpense) throw Error('Travel Expense not found');

    return {
      dataResult: travelExpense,
    };
  },
};
