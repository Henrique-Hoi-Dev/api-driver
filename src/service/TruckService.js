import * as Yup from 'yup';
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

    const trucks = await Truck.findAll({
      attributes: [ 
        'id', 
        'truck_models', 
        'truck_board', 
        'truck_km', 
        'truck_year',
      ], 
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: trucks }      
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
      ],  
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: truck }      
    return result
  },

  async updateTruck(req, res) {   
    let result = {}

    let users = req
    let userId = res.id

    const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(8),
        password: Yup.string().min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field),
        confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(users))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const { email, oldPassword } = users ;
    
    const user = await Truck.findByPk(userId);
    
    if (email !== user.dataValues.email) {
      const userExist = await Truck.findOne({ where: { email } });

      if (userExist) {
        result = { httpStatus: httpStatus.CONFLICT, msg: 'This user email already exists.' };
        return result;
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      result = { httpStatus: httpStatus.METHOD_FAILURE, msg: 'Password does not match!' };
      return result;
    }

    await user.update(users);

    const userResult = await Truck.findByPk(userId, {
      attributes: [
        'id',
        'name', 
        'email', 
        'type_position', 
        'cpf', 
      ],
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: userResult }      
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
      result = {httpStatus: httpStatus.BAD_REQUEST, msg: 'user not found' }      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted user' }}      
    return result
  }
}