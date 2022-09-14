import * as Yup from 'yup';
import Driver from "../app/models/Driver";
import httpStatus from 'http-status-codes';

export default {
  async createDriver(req, res) {
    let result = {}
    let driverBody = req;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(driverBody))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const driver = await Driver.create(driverBody);

    if (!driver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Fail to create' }      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllDriver(req, res) {
    let result = {}

    const { page = 1, limit = 100, sort_order = 'ASC', sort_field = 'name' } = req.query;
    const total = (await Driver.findAll()).length;

    const totalPages = Math.ceil(total / limit);

    const drivers = await Driver.findAll({
      order: [[ sort_field, sort_order ]],
      limit: limit,
      offset: (page - 1) ? (page - 1) * limit : 0,
      attributes: [ 
        'id',
        'name', 
        'conjunto', 
        'number_cnh', 
        'valid_cnh', 
        'date_valid_mopp', 
        'date_valid_nr20', 
        'date_valid_nr35', 
        'cpf', 
        'date_admission', 
        'date_birthday', 
      ], 
    });

    const currentPage = Number(page)

    result = { 
      httpStatus: httpStatus.OK, 
      status: "successful", 
      total, 
      totalPages, 
      currentPage, 
      dataResult: drivers 
    } 

    return result
  },

  async getIdDriver(req, res) {
    let result = {}

    let driver = await Driver.findByPk(req.id, {
      attributes: [ 
        'id',
        'name', 
        'conjunto', 
        'number_cnh', 
        'valid_cnh', 
        'date_valid_mopp', 
        'date_valid_nr20', 
        'date_valid_nr35', 
        'cpf', 
        'date_admission', 
        'date_birthday', 
      ],  
    });

    if (!driver) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Driver not found' }}      
      return result
    }

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: driver }      
    return result
  },

  async updateDriver(req, res) {   
    let result = {}

    let drivers = req
    let driverId = res.id

    const schema = Yup.object().shape({
        name: Yup.string(),
        oldPassword: Yup.string().min(8),
        password: Yup.string().min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field),
        confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(drivers))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const { oldPassword } = drivers ;
    
    const driver = await Driver.findByPk(driverId);

    if (oldPassword && !(await driver.checkPassword(oldPassword))) {
      result = { httpStatus: httpStatus.METHOD_FAILURE, msg: 'Password does not match!' };
      return result;
    }

    await driver.update(drivers);

    const driverResult = await Driver.findByPk(driverId, {
      attributes: [
        'id',
        'name', 
        'conjunto', 
        'number_cnh', 
        'valid_cnh', 
        'date_valid_mopp', 
        'date_valid_nr20', 
        'date_valid_nr35', 
        'cpf', 
        'date_admission', 
        'date_birthday', 
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: driverResult }      
    return result
  },
  
  async deleteDriver(req, res) {
    let result = {}
    
    const id  = req.id;

    const driver = await Driver.destroy({
      where: {
        id: id,
      },
    });

    if (!driver) {
      result = {httpStatus: httpStatus.BAD_REQUEST, responseData: { msg: 'Driver not found' }}      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted driver' }}      
    return result
  }
}