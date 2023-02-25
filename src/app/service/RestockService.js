import httpStatus from 'http-status-codes';

import Restock from '../models/Restock';
import Freight from '../models/Freight';
import FinancialStatements from '../models/FinancialStatements';

export default {
  async createRestock(user, body) {
    let result = {};

    let { freight_id, value_fuel, liters_fuel } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: user.driverId, status: true },
    });

    const freight = await Freight.findByPk(freight_id);

    if (!financial) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Financial statements not found',
      };
      return result;
    }

    if (!freight) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Freight not found' };
      return result;
    }

    let total_value_fuel = value_fuel * liters_fuel;

    await Restock.create({
      ...body,
      financial_statements_id: financial.id,
      total_value_fuel,
    });

    result = { httpStatus: httpStatus.CREATED, status: 'successful' };
    return result;
  },

  async getAllRestock(req, res) {
    let result = {};

    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = req.query;
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

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      total,
      totalPages,
      currentPage,
      dataResult: restocks,
    };

    return result;
  },

  async getIdRestock(req, res) {
    let result = {};

    let restock = await Restock.findByPk(req.id, {
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

    if (!restock) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Restocks not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: restock,
    };
    return result;
  },
};
