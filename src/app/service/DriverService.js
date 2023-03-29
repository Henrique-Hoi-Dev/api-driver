import * as Yup from 'yup';
import Driver from '../models/Driver';

export default {
  async profile(id) {
    const driver = await Driver.findByPk(id, {
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

    if (!driver) throw Error('Driver not found');

    return {
      dataResult: driver,
    };
  },

  async update(id, body) {
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

    if (!(await schema.isValid(body))) throw Error('Validation failed!');

    const { oldPassword } = body;

    const driver = await Driver.findByPk(id);

    if (oldPassword && !(await driver.checkPassword(oldPassword)))
      throw Error('Password does not match!');

    await driver.update({ ...body });

    return {
      dataResult: await Driver.findByPk(id, {
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
      }),
    };
  },
};
