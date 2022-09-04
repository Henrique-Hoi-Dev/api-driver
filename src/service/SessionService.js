import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import httpStatus from 'http-status-codes';

import User from '../app/models/User';
import authConfig from '../config/auth';

export default {

  async sessionUser(req, res) {
    let result = {}
    let body = req

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(body))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const { email, password } = body;
    
    const user = await User.findOne({  where: { email } });

    if (!user) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not found' }      
      return result
    }

    if (!(await user.checkPassword(password))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Password is incorrect' }      
      return result
    }

    const { id, name, type_position, cpf } = user;

    const users = { id, name, email, type_position, cpf },
      token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: {users, token} }      
    return result
  }
}
