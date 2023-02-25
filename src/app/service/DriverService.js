import * as Yup from 'yup';
import httpStatus from 'http-status-codes';

import Driver from '../models/Driver';

export default {
  async profile(id) {
    let result = {};

    let driver = await Driver.findByPk(id, {
      attributes: [
        'id',
        'name',
        'number_cnh',
        'valid_cnh',
        'date_valid_mopp',
        'date_valid_nr20',
        'date_valid_nr35',
        'cpf',
        'date_admission',
        'date_birthday',
        'credit',
        'value_fix',
        'percentage',
        'daily',
      ],
    });

    if (!driver) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        responseData: { msg: 'Driver not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: driver,
    };
    return result;
  },

  async update(user, code) {
    let result = {};

    const schema = Yup.object().shape({
      name: Yup.string(),
      oldPassword: Yup.string().min(8),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(user.body))) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Validation failed!',
      };
      return result;
    }

    const { oldPassword } = user.body;

    const driver = await Driver.findByPk(user.driverId);

    if (oldPassword && !(await driver.checkPassword(oldPassword))) {
      result = {
        httpStatus: httpStatus.METHOD_FAILURE,
        msg: 'Password does not match!',
      };
      return result;
    }

    await driver.update(user.body);

    const driverResult = await Driver.findByPk(user.driverId, {
      attributes: [
        'id',
        'name',
        'name_user',
        'number_cnh',
        'valid_cnh',
        'date_valid_mopp',
        'date_valid_nr20',
        'date_valid_nr35',
        'cpf',
        'date_admission',
        'date_birthday',
        'credit',
        'value_fix',
        'percentage',
        'daily',
      ],
    });

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: driverResult,
    };
    return result;
  },
};
