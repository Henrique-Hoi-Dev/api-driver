import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import Driver from '../models/Driver';

export default {
  async sessionDriver(headers) {
    const { name_user, password } = headers;

    const body = { name_user: name_user.toLowerCase(), password };

    const schema = Yup.object().shape({
      name_user: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(body))) throw Error('Validation failed!');

    const driver = await Driver.findOne({
      where: { name_user: body.name_user },
    });
    if (!driver) throw Error('Driver not found');
    if (!(driver.dataValues.type_positions === 'COLLABORATOR'))
      throw Error('You do not have permission to log into this account');

    if (!(await driver.checkPassword(password)))
      throw Error('Password is incorrect');

    const { id, credit, value_fix, percentage, type_positions, status } =
      driver;

    const drivers = {
        id,
        name_user,
        credit,
        value_fix,
        percentage,
        type_positions,
        status,
      },
      token = jwt.sign(
        {
          id,
          type_positions,
          name_user,
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
      dataResult: { drivers, token },
    };
  },
};
