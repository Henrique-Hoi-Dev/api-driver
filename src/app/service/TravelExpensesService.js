import TravelExpenses from '../models/TravelExpenses';
import FinancialStatements from '../models/FinancialStatements';
import Freight from '../models/Freight';

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export default {
  async create(driverId, body) {
    let { freight_id } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financial) throw new CustomError('FINANCIAL_NOT_FOUND', 404);

    const freight = await Freight.findByPk(freight_id);
    if (!freight) throw new CustomError('FREIGHT_NOT_FOUND', 404);

    if (freight.status === 'STARTING_TRIP') {
      const result = await TravelExpenses.create({
        ...body,
        financial_statements_id: financial.id,
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

    const totalItems = (await TravelExpenses.findAll()).length;
    const totalPages = Math.ceil(totalItems / limit);

    const travelExpenses = await TravelExpenses.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
    });

    const currentPage = Number(page);

    return {
      data: travelExpenses,
      totalItems,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const travelExpense = await TravelExpenses.findByPk(id, {});

    if (!travelExpense) throw Error('TRAVEL_NOT_FOUND');

    return {
      data: travelExpense,
    };
  },
};
