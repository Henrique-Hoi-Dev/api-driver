import Restock from '../models/Restock';
import Freight from '../models/Freight';
import FinancialStatements from '../models/FinancialStatements';

export default {
  async create(driverId, body) {
    let { freight_id, value_fuel, liters_fuel } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financial) throw Error('FINANCIAL_NOT_FOUND');

    const freight = await Freight.findByPk(freight_id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    if (freight.status === 'STARTING_TRIP') {
      const total_value_fuel = value_fuel * liters_fuel;

      const result = await Restock.create({
        ...body,
        total_value_fuel,
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

    const total = (await Restock.findAll()).length;
    const totalPages = Math.ceil(total / limit);

    const restocks = await Restock.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'name_establishment',
        'freight_id',
        'city',
        'date',
        'value_fuel',
        'liters_fuel',
        'total_value_fuel',
        'total_nota_value',
      ],
    });

    const currentPage = Number(page);

    return {
      dataResult: restocks,
      total,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const restock = await Restock.findByPk(id, {
      attributes: [
        'id',
        'name_establishment',
        'freight_id',
        'city',
        'date',
        'value_fuel',
        'liters_fuel',
        'total_value_fuel',
        'total_nota_value',
      ],
    });

    if (!restock) throw Error('RESTOCK_NOT_FOUND');

    return {
      dataResult: restock,
    };
  },
};
