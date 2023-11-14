import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import Driver from '../models/Driver';

export default {
  async sessionDriver(body) {
    const { cpf, password } = body;

    const schema = Yup.object().shape({
      cpf: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(body))) throw Error('VALIDATION_ERROR');

    const driver = await Driver.findOne({
      where: { cpf: cpf },
    });

    if (!driver) throw Error('DRIVER_NOT_FOUND');

    if (!(driver.dataValues.type_positions === 'COLLABORATOR'))
      throw Error('INSUFFICIENT_PERMISSIONS');

    if (!(await driver.checkPassword(password)))
      throw Error('INVALID_USER_PASSWORD');

    const { id, credit, value_fix, percentage, type_positions, status } =
      driver;

    // const drivers = {
    //     id,
    //     credit,
    //     value_fix,
    //     percentage,
    //     type_positions,
    //     status,
    //   },
    const token = jwt.sign(
      {
        id,
        cpf,
        type_positions,
        status,
        credit,
        value_fix,
        percentage,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      }
    );

    return {
      data: { token },
    };
  },
};
