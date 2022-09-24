import httpStatus from 'http-status-codes';

import Freight from "../app/models/Freight";
import FinancialStatements from "../app/models/FinancialStatements";

export default {
  async createFreight(req, res) {
    let result = {}
    let freightBody = req;

    const financial = await FinancialStatements.findByPk(freightBody.financial_statements_id)

    if (!financial) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Financial not found' }      
      return result
    }

    await Freight.create(freightBody);

    result = { httpStatus: httpStatus.OK, status: "First check order successful!" }      
    return result
  },

  async getAllFreight(req, res) {
    let result = {}
    
    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await Freight.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const freights = await Freight.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        "id",
        "financial_statements_id",
        "start_city",
        "final_city",
        "location_of_the_truck",
        "contractor",
        "start_km",
        "status_check_order",
        "preview_tonne",
        "value_tonne",
        "preview_value_diesel",
        "final_km",
        "final_total_tonne",
        "toll_value",
        "discharge",
        "img_proof_cte",
        "img_proof_ticket",
        "img_proof_freight_letter",
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: freights 
    } 

    return result
  },

  async getIdFreight(req, res) {
    let result = {}

    let freight = await Freight.findByPk(req.id, {
      attributes: [ 
        "id",
        "financial_statements_id",
        "start_city",
        "final_city",
        "location_of_the_truck",
        "contractor",
        "start_km",
        "status_check_order",
        "preview_tonne",
        "value_tonne",
        "preview_value_diesel",
        "final_km",
        "final_total_tonne",
        "toll_value",
        "discharge",
        "img_proof_cte",
        "img_proof_ticket",
        "img_proof_freight_letter",
      ],  
    });

    if (!freight) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Freight not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: freight }      
    return result
  },

  async updateFreight(req, res) {   
    let result = {}

    let freights = req
    let freightId = res.id

    const freight = await Freight.findByPk(freightId);

    await freight.update(freights);

    const freightResult = await Freight.findByPk(freightId, {
      attributes: [
        "id",
        "financial_statements_id",
        "start_city",
        "final_city",
        "location_of_the_truck",
        "contractor",
        "start_km",
        "status_check_order",
        "preview_tonne",
        "value_tonne",
        "preview_value_diesel",
        "final_km",
        "final_total_tonne",
        "toll_value",
        "discharge",
        "img_proof_cte",
        "img_proof_ticket",
        "img_proof_freight_letter",
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: freightResult }      
    return result
  },
  
  async deleteFreight(req, res) {
    let result = {}
    
    const id  = req.id;

    const freight = await Freight.destroy({
      where: {
        id: id,
      },
    });

    if (!freight) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Freight not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted freight' }}      
    return result
  }
}