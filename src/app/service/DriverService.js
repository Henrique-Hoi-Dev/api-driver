import * as Yup from 'yup';
import Driver from '../models/Driver';
import ValidateCode from '../models/ValidateCode';
import { generateRandomCode } from '../utils/crypto';
import { createExpirationDateFromNow } from '../utils/date';
import { sendSMS } from '../providers/aws';
import { generateToken } from '../utils/jwt';

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

    if (!driver) throw Error('DRIVER_NOT_FOUND');

    return {
      data: driver,
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

    if (!(await schema.isValid(body))) throw Error('VALIDATION_ERROR');

    const { oldPassword } = body;

    const driver = await Driver.findByPk(id);

    if (oldPassword && !(await driver.checkPassword(oldPassword)))
      throw Error('PASSWORDS_NOT_MATCHED');

    await driver.update({ ...body });

    return {
      data: await Driver.findByPk(id),
    };
  },

  async requestCodeValidation({ phone }) {
    try {
      const user = await Driver.findOne({
        where: {
          phone: phone,
        },
      });

      if (!user || !user.phone) throw Error('CELL_PHONE_DOES_NOT_EXIST');

      const verificationCode = generateRandomCode();
      const expirationDate = createExpirationDateFromNow(30);

      await ValidateCode.update(
        { status: 'EXPIRED' },
        {
          where: {
            cpf: user.cpf,
            status: 'AVAILABLE',
          },
        }
      );

      const code = await ValidateCode.create({
        cpf: user.cpf,
        expiration_date: expirationDate,
        code: verificationCode,
        status: 'AVAILABLE',
      });

      const message =
        `Olá,\n\n` +
        `Você solicitou uma redefinição de senha em LOGBOOK. Use o código de verificação abaixo para prosseguir com a redefinição:\n\n` +
        `*Código de Verificação*: *${code.code}*\n\n` +
        `Por questões de segurança, este código é válido por apenas 15 minutos. Não compartilhe este código com ninguém.\n\n` +
        `Se você não solicitou uma redefinição de senha, por favor ignore esta mensagem.`;

      let resultSendSMS = await sendSMS({
        phoneNumber: phone,
        message,
      });

      resultSendSMS.cpf = user.cpf;
      resultSendSMS.code = verificationCode;

      return { token: generateToken(resultSendSMS) };
    } catch (error) {
      if (
        ['CELL_PHONE_DOES_NOT_EXIST', 'ERROR_SENDING_CODE'].includes(
          error.message
        )
      ) {
        throw new Error(`${error.message}`);
      } else {
        throw error;
      }
    }
  },

  async validCodeForgotPassword({ code, cpf }) {
    const validCode = await ValidateCode.findOne({
      where: {
        cpf,
        code,
        status: 'AVAILABLE',
      },
    });

    let valid = true;

    if (!validCode) {
      // O código não foi encontrado ou não está disponível
      valid = false;
      throw Error('VERIFICATION_CODE_NOT_FOUND');
    }

    // Verificar se o código expirou
    const expirationTime = new Date(
      validCode.expiration_date.getTime() + 15 * 60000
    );
    const now = new Date();

    if (expirationTime < now) {
      // Código expirou
      valid = false;

      await ValidateCode.update(
        { status: 'EXPIRED' },
        {
          where: {
            cpf: validCode.cpf,
            code,
          },
        }
      );

      throw Error('CODE_IS_ALREADY_EXPIRED');
    }

    const [upValidOk] = await ValidateCode.update(
      { status: 'USED' },
      {
        where: {
          cpf: validCode.cpf,
          code,
          status: 'AVAILABLE',
        },
      }
    );

    const driver = await Driver.findOne({
      where: { cpf },
    });

    if (!driver) throw Error('DRIVER_NOT_FOUND');

    if (upValidOk) {
      return {
        token: generateToken({
          valid: true,
          name: driver.name,
          phone: driver.phone,
          cpf: driver.cpf,
        }),
      };
    } else {
      return { valid: false, mgs: 'Erro no validar Código' };
    }
  },

  async forgotPassword(body) {
    try {
      const schema = Yup.object().shape({
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

      if (!(await schema.isValid(body))) throw Error('VALIDATION_ERROR');

      const { password, cpf } = body;

      const driver = await Driver.findOne({ where: { cpf } });

      // if (oldPassword && !(await driver.checkPassword(oldPassword)))
      //   throw Error('PASSWORDS_NOT_MATCHED');

      // Verifica se a nova senha é diferente da antiga
      if (password && (await driver.checkPassword(password))) {
        throw new Error('NEW_PASSWORD_SAME_AS_OLD');
      }

      await driver.update({ password });

      return {
        mgs: 'update success',
      };
    } catch (error) {
      return error;
    }
  },
};
