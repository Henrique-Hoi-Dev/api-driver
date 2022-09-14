import Restock from "../app/models/Restock";
import httpStatus from 'http-status-codes';

export default {
  async createRestock(req, res) {
    let result = {}
    let restockBody = req;

    Restock.create(restockBody);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllRestock(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'id' } = req.query;
    const total = (await Restock.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const restocks = await Restock.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id',
        'name_establishment', 
        'city', 
        'date', 
        'value', 
        'proof_img', 
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: restocks 
    } 

    return result
  },

  async getIdRestock(req, res) {
    let result = {}

    let restock = await Restock.findByPk(req.id, {
      attributes: [ 
        'id',
        'name_establishment', 
        'city', 
        'date', 
        'value', 
        'proof_img', 
      ],  
    });

    if (!restock) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Restocks not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: restock }      
    return result
  },

  async updateRestock(req, res) {   
    let result = {}

    let restocks = req
    let restockId = res.id

    const restock = await Restock.findByPk(restockId);

    await restock.update(restocks);

    const restockResult = await Restock.findByPk(restockId, {
      attributes: [
        'id',
        'name_establishment', 
        'city', 
        'date', 
        'value', 
        'proof_img', 
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: restockResult }      
    return result
  },
  
  async deleteRestock(req, res) {
    let result = {}
    
    const id  = req.id;

    const restock = await Restock.destroy({
      where: {
        id: id,
      },
    });

    if (!restock) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Restocks not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted restock' }}      
    return result
  }
}