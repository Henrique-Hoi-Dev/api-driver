import httpStatus from 'http-status-codes';

import Driver from '../models/Driver';
import Freight from '../models/Freight';
import FinancialStatements from '../models/FinancialStatements';

export default {
  async getAllFinished(id, query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = query;

    const total = (
      await FinancialStatements.findAll({
        where: { driver_id: id, status: false },
      })
    ).length;

    const totalPages = Math.ceil(total / limit);

    const financialStatements = await FinancialStatements.findAll({
      where: { driver_id: id, status: false },
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

    return {
      dataResult: financialStatements,
      total,
      totalPages,
      currentPage,
    };
  },

  async getInProgress(id) {
    const financialStatement = await FinancialStatements.findOne({
      where: { driver_id: id, status: true },
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

    if (!financialStatement) throw Error('Financial Statements not found');
    return { dataResult: financialStatement };
  },

  async update(body, driverId) {
    const financialStatement = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financialStatement) throw Error('Financial not found');

    const { id, truck_models, cart_models, driver_id } =
      await financialStatement.update(body);

    const driverFinancial = await Driver.findByPk(driver_id);
    if (!driverFinancial) throw Error('Driver not found');

    await driverFinancial.update({
      credit: 0,
      truck: truck_models,
      cart: cart_models,
    });

    const driver = await Driver.findByPk(driver_id, {
      attributes: ['credit', 'truck', 'cart'],
    });

    const financial = await FinancialStatements.findByPk(id);

    return { dataResult: driver, financial: financial };
  },
};
