import Restock from '../models/Restock';
import Freight from '../models/Freight';
import FinancialStatements from '../models/FinancialStatements';

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export default {
  async create(driverId, body) {
    let { freight_id, value_fuel, liters_fuel } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financial) throw new CustomError('FINANCIAL_NOT_FOUND', 404);

    const freight = await Freight.findByPk(freight_id);
    if (!freight) throw new CustomError('FREIGHT_NOT_FOUND', 404);

    if (freight.status === 'STARTING_TRIP') {
      const total_value_fuel = value_fuel * liters_fuel;

      const result = await Restock.create({
        ...body,
        total_value_fuel,
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

    const totalItems = (await Restock.findAll()).length;
    const totalPages = Math.ceil(totalItems / limit);

    const restocks = await Restock.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
    });

    const currentPage = Number(page);

    return {
      data: restocks,
      totalItems,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const restock = await Restock.findByPk(id, {});

    if (!restock) throw Error('RESTOCK_NOT_FOUND');

    return {
      data: restock,
    };
  },
};
