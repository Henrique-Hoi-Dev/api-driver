import httpStatus from 'http-status-codes';

import DepositMoney from '../models/DepositMoney';
import FinancialStatements from '../models/FinancialStatements';
import Freight from '../models/Freight';

export default {
  async createDepositMoney(req, res) {
    let result = {};
    let depositMoneyBody = req;

    const financial = await FinancialStatements.findByPk(
      req.financial_statements_id
    );
    const freight = await Freight.findByPk(req.freight_id);

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

    await DepositMoney.create(depositMoneyBody);

    result = { httpStatus: httpStatus.CREATED, status: 'successful' };
    return result;
  },

  async getAllDepositMoney(req, res) {
    let result = {};

    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = req.query;
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

  async getIdDepositMoney(req, res) {
    let result = {};

    let depositMoney = await DepositMoney.findByPk(req.id, {
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
        responseData: { msg: 'Deposit Money not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: depositMoney,
    };
    return result;
  },
};
