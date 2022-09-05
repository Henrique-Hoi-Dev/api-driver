import * as Yup from 'yup';
import Driver from "../app/models/Driver";
import httpStatus from 'http-status-codes';

export default {
  async createDriver(req, res) {
    let result = {}
    let driverBody = req;

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

    const drivers = await Driver.findAll({
      attributes: [ 
        'id', 
        'name', 
        'set', 
        'number_cnh', 
        'valid_cnh',
        'valid_mopp',
        'cpf'
      ], 
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: drivers }      
    return result
  },

  async getIdDriver(req, res) {
    let result = {}

    let driver = await Driver.findByPk(req.id, {
      attributes: [ 
        'id', 
        'name', 
        'set', 
        'number_cnh', 
        'valid_cnh',
        'valid_mopp',
        'cpf'
      ],  
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: driver }      
    return result
  },

  async updateDriver(req, res) {   
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
    
    const user = await Driver.findByPk(userId);
    
    if (email !== user.dataValues.email) {
      const userExist = await Driver.findOne({ where: { email } });

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

    const userResult = await Driver.findByPk(userId, {
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
  
  async deleteDriver(req, res) {
    let result = {}
    
    const id  = req.id;

    const drivers = await Driver.destroy({
      where: {
        id: id,
      },
    });

    if (!drivers) {
      result = {httpStatus: httpStatus.BAD_REQUEST, msg: 'user not found' }      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted user' }}      
    return result
  }
}