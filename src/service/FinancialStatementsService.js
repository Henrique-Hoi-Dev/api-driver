import httpStatus from 'http-status-codes';

import FinancialStatements from "../app/models/FinancialStatements";
import Driver from '../app/models/Driver';
import Truck from '../app/models/Truck';
import Cart from '../app/models/Cart';

export default {
  async createFinancialStatements(req, res) {
    let result = {}
    let { driver_id, truck_id, cart_id, start_date } = req;

    const driver = await Driver.findByPk(driver_id)
    const truck = await Truck.findByPk(truck_id)
    const cart = await Cart.findByPk(cart_id)

    if (!driver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Driver not found' }      
      return result
    }

    if (!truck) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Truck not found' }      
      return result
    }

    if (!cart) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Cart not found' }      
      return result
    }

    const driver_name = driver.dataValues.name
    const { truck_models, truck_board, truck_avatar } = truck.dataValues
    const { cart_models, cart_board } = cart.dataValues

    const body = { 
      driver_id, 
      truck_id,
      status: true,
      start_date, 
      driver_name, 
      truck_models, 
      truck_board, 
      truck_avatar,
      cart_models,
      cart_board
    }

    await FinancialStatements.create(body);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllFinancialStatements(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await FinancialStatements.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const financialStatements = await FinancialStatements.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id', 
        'driver_id',
        'truck_id',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'truck_models',
        'truck_avatar',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
      ],
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: financialStatements 
    }      
    
    return result
  },

  async getIdFinancialStatements(req, res) {
    let result = {}

    let financialStatement = await FinancialStatements.findByPk(req.id, {
      attributes: [ 
        'id', 
        'driver_id',
        'truck_id',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'truck_models',
        'truck_avatar',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
      ],
    });

    if (!financialStatement) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Financial Statements not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: financialStatement }      
    return result
  },

  async updateFinancialStatements(req, res) {   
    let result = {}

    let financialStatements = req
    let financialStatementId = res.id
    
    const financialStatement = await FinancialStatements.findByPk(financialStatementId);

    await financialStatement.update(financialStatements);

    const userResult = await FinancialStatements.findByPk(financialStatementId, {
      attributes: [
        'id', 
        'driver_id',
        'truck_id',
        'start_km',
        'final_km',
        'start_date',
        'final_date',
        'driver_name',
        'truck_models',
        'truck_avatar',
        'truck_board',
        'cart_models',
        'cart_board',
        'invoicing_all',
        'medium_fuel_all',
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: userResult }      
    return result
  },
  
  async deleteFinancialStatements(req, res) {
    let result = {}
    
    const id  = req.id;

    const financialStatement = await FinancialStatements.destroy({
      where: {
        id: id,
      },
    });

    if (!financialStatement) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Financial Statements not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted Financial Statements ' }}      
    return result
  }
}