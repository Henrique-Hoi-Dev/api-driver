import httpStatus from 'http-status-codes';

import DepositMoney from '../models/DepositMoney';
import FinancialStatements from '../models/FinancialStatements';
import Freight from '../models/Freight';

export default {
  async createDepositMoney(user, body) {
    let result = {};

    const { freight_id } = body;

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

    await DepositMoney.create({
      ...body,
      financial_statements_id: financial.id,
    });

    result = { httpStatus: httpStatus.CREATED, status: 'successful' };
    return result;
  },

  async getAllDepositMoney(query) {
    let result = {};

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

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      total,
      totalPages,
      currentPage,
      dataResult: depositMoney,
    };

    return result;
  },

  async getIdDepositMoney(id) {
    let result = {};

    let depositMoney = await DepositMoney.findByPk(id, {
      attributes: [
        'id',
        'type_transaction',
        'local',
        'type_bank',
        'value',
        'proof_img',
      ],
    });

    if (!depositMoney) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Deposit Money not found',
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: { ...depositMoney, value: Number(depositMoney.value) },
    };
    return result;
  },
};
