import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import httpStatus from 'http-status-codes';

import authConfig from '../../config/auth';
import Driver from '../models/Driver';

export default {

  async sessionDriver(req, res) {
    let result = {}

    let { name_user, password } = req

    let body = { name_user: name_user.toLowerCase(), password }

    const schema = Yup.object().shape({
      name_user: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(body))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Validation failed!' };
      return result
    }

    const driver = await Driver.findOne({ where: { name_user: body.name_user } });

    if (!driver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Driver not found' }      
      return result
    }

    if (!(driver.dataValues.type_positions === "COLLABORATOR")) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: "You do not have permission to log into this account" }
      return result
    }

    if (!(await driver.checkPassword(password))) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Password is incorrect' }      
      return result
    }

    const { id, credit, value_fix, percentage,  type_positions, status } = driver;

    const drivers = { id, name_user, credit, value_fix, percentage, type_positions, status },
      token = jwt.sign({ id, type_positions, name_user, status, credit, value_fix, percentage }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: {drivers, token} }      
    return result
  }
}
