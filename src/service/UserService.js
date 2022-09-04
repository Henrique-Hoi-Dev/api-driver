import * as Yup from 'yup';
import User from "../app/models/User";
import httpStatus from 'http-status-codes';

export default {
  async createUser(req, res) {
    let result = {}
    let user = req
    
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(user))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    // doing email verification
    const userExist = await User.findOne({ where: { email: user.email } });

    if (userExist) {
      result = { httpStatus: httpStatus.CONFLICT, msg: 'This user email already exists.' };
      return result;
    }

    await User.create(user);

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },

  async getAllUser(req, res) {
    let result = {}

    const users = await User.findAll({
      attributes: [ 
        'id', 
        'name', 
        'email', 
        'type_position', 
        'cpf',
      ], 
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: users }      
    return result
  },

  async getIdUser(req, res) {
    let result = {}

    let user = await User.findByPk(req.id, {
      attributes: [ 
        'id',
        'name', 
        'email', 
        'type_position', 
        'cpf',
      ],  
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: user }      
    return result
  },

  async updateUser(req, res) {   
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
    
    const user = await User.findByPk(userId);
    
    if (email !== user.dataValues.email) {
      const userExist = await User.findOne({ where: { email } });

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

    const userResult = await User.findByPk(userId, {
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
  
  async deleteUser(req, res) {
    let result = {}
    
    const id  = req.id;

    const users = await User.destroy({
      where: {
        id: id,
      },
    });

    if (!users) {
      result = {httpStatus: httpStatus.BAD_REQUEST, msg: 'user not found' }      
      return result
    }

    result = {httpStatus: httpStatus.OK, status: "successful", responseData: { msg: 'Deleted user' }}      
    return result
  }
}