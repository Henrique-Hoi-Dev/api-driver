import Truck from "../app/models/Truck";
import httpStatus from 'http-status-codes';

export default {
  async createTruck(req, res) {
    let result = {}
    let truckBody = req;

    const truck = await Truck.create(truckBody);

    if (!truck) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Fail to create' }      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllTruck(req, res) {
    let result = {}
    
    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'truck_models' } = req.query;
    const total = (await Truck.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const trucks = await Truck.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id', 
        'truck_models', 
        'truck_board', 
        'truck_km', 
        'truck_year',
        'truck_avatar',
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: trucks 
    } 

    return result
  },

  async getIdTruck(req, res) {
    let result = {}

    let truck = await Truck.findByPk(req.id, {
      attributes: [ 
        'id', 
        'truck_models', 
        'truck_board', 
        'truck_km', 
        'truck_year',
        'truck_avatar',
      ],  
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: truck }      
    return result
  },

  async updateTruck(req, res) {   
    let result = {}

    let trucks = req
    let truckId = res.id

    const truck = await Truck.findByPk(truckId);

    await truck.update(trucks);

    const truckResult = await Truck.findByPk(truckId, {
      attributes: [
        'id',
        'truck_models', 
        'truck_board', 
        'truck_km', 
        'truck_year', 
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: truckResult }      
    return result
  },
  
  async deleteTruck(req, res) {
    let result = {}
    
    const id  = req.id;

    const trucks = await Truck.destroy({
      where: {
        id: id,
      },
    });

    if (!trucks) {
      result = {httpStatus: httpStatus.BAD_REQUEST, msg: 'Truck not found' }      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted truck' }}      
    return result
  }
}