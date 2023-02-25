import httpStatus from 'http-status-codes';

import Driver from '../models/Driver';
import Freight from '../models/Freight';
import FinancialStatements from '../models/FinancialStatements';

export default {
  async getAllFinancialStatementsFinished(req, res) {
    let result = {};

    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = req.query;
    const total = (await FinancialStatements.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const financialStatements = await FinancialStatements.findAll({
      where: { driver_id: req.driverId, status: false },
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: [
        'id',
        'creator_user_id',
        'driver_id',
        'truck_id',
        'cart_id',
        'status',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'percentage_commission',
        'fixed_commission',
        'daily',
        'truck_models',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
        'total_value',
        'truck_avatar',
      ],
      include: {
        model: Freight,
        as: 'freigth',
        attributes: [
          'id',
          'financial_statements_id',
          'start_freight_city',
          'final_freight_city',
          'location_of_the_truck',
          'contractor',
          'truck_current_km',
          'status',
          'preview_tonne',
          'value_tonne',
          'liter_of_fuel_per_km',
          'preview_value_diesel',
          'truck_km_completed_trip',
          'tons_loaded',
          'toll_value',
          'discharge',
          'img_proof_cte',
          'img_proof_ticket',
          'img_proof_freight_letter',
        ],
      },
    });

    const currentPage = Number(page);

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      total,
      totalPages,
      currentPage,
      dataResult: financialStatements,
    };

    return result;
  },

  async getIdFinancialStatements(req, res) {
    let result = {};

    const financialStatement = await FinancialStatements.findOne({
      where: { driver_id: req.driverId, status: true },
      attributes: [
        'id',
        'creator_user_id',
        'driver_id',
        'truck_id',
        'cart_id',
        'status',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'percentage_commission',
        'fixed_commission',
        'daily',
        'truck_models',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
        'total_value',
        'truck_avatar',
      ],
      include: {
        model: Freight,
        as: 'freigth',
        attributes: [
          'id',
          'financial_statements_id',
          'start_freight_city',
          'final_freight_city',
          'location_of_the_truck',
          'contractor',
          'truck_current_km',
          'status',
          'preview_tonne',
          'value_tonne',
          'liter_of_fuel_per_km',
          'preview_value_diesel',
          'truck_km_completed_trip',
          'tons_loaded',
          'toll_value',
          'discharge',
          'img_proof_cte',
          'img_proof_ticket',
          'img_proof_freight_letter',
        ],
      },
    });

    if (!financialStatement) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Financial Statements not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: financialStatement,
    };
    return result;
  },

  async updateFinancialStatements(req, res) {
    let result = {};

    let financialStatements = req;

    let financialStatementId = res.id;

    const financialStatement = await FinancialStatements.findByPk(
      financialStatementId
    );

    if (!financialStatement) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Financial not found',
      };
      return result;
    }

    const resultUpdate = await financialStatement.update(financialStatements);

    const driverFinancial = await Driver.findByPk(resultUpdate.driver_id);

    if (!driverFinancial) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Driver not found',
      };
      return result;
    }

    const creditUser = 0;

    const { truck_models, cart_models } = resultUpdate;

    await driverFinancial.update({
      credit: creditUser,
      truck: truck_models,
      cart: cart_models,
    });

    result = { httpStatus: httpStatus.OK, status: 'successful' };
    return result;
  },
};
