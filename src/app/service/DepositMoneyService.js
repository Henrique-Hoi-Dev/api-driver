import DepositMoney from '../models/DepositMoney';
import FinancialStatements from '../models/FinancialStatements';
import Freight from '../models/Freight';
import Driver from '../models/Driver';
import { deleteFile, sendFile } from '../providers/aws';
import { generateRandomCode } from '../utils/crypto';
import { updateHours } from '../utils/updateHours';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export default {
  async create(user, body) {
    const { freight_id } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: user.id, status: true },
    });
    if (!financial) throw new CustomError('FINANCIAL_NOT_FOUND', 404);

    const freight = await Freight.findByPk(freight_id);

    if (!freight) throw new CustomError('FREIGHT_NOT_FOUND', 404);

    if (freight.status === 'STARTING_TRIP') {
      const now = updateHours(dayjs().tz('America/Sao_Paulo').utcOffset() / 60);

      const result = await DepositMoney.create({
        ...body,
        registration_date: now,
        financial_statements_id: financial.id,
      });

      const driverFind = await Driver.findByPk(user.id);
      driverFind.addTransaction({
        value: result.value,
        typeTransactions: result.type_transaction,
      });

      const driver = await Driver.findByPk(driverFind.id);
      const values = driverFind.transactions.map((res) => res.value);
      const total = values.reduce((acc, cur) => acc + cur, 0);

      await driver.update({
        transactions: driverFind.transactions,
        credit: total,
      });

      return { data: result };
    }

    throw new CustomError('This front is not traveling', 404);
  },

  async uploadDocuments(payload, { id }) {
    const { file, body } = payload;

    const depositMoney = await DepositMoney.findByPk(id);
    if (!depositMoney) throw Error('DEPOSIT_MONEY_NOT_FOUND');

    if (!body.category) throw Error('CATEGORY_OR_TYPE_NOT_FOUND');

    const originalFilename = file.originalname;

    const code = generateRandomCode(9);

    file.name = code;

    await sendFile(payload);

    const infoDepositMoney = await depositMoney.update({
      img_receipt: {
        uuid: file.name,
        name: originalFilename,
        mimetype: file.mimetype,
        category: body.category,
      },
    });

    return infoDepositMoney;
  },

  async deleteFile({ id }) {
    const depositMoney = await DepositMoney.findByPk(id);
    if (!depositMoney) throw Error('FREIGHT_NOT_FOUND');

    try {
      await this._deleteFileIntegration({
        filename: depositMoney.img_receipt.uuid,
        category: depositMoney.img_receipt.category,
      });

      const infoDepositMoney = await depositMoney.update({
        img_receipt: {},
      });

      return infoDepositMoney;
    } catch (error) {
      throw error;
    }
  },

  async _deleteFileIntegration({ filename, category }) {
    try {
      return await deleteFile({ filename, category });
    } catch (error) {
      throw error;
    }
  },

  async getAll(query) {
    const {
      page = 1,
      limit = 10,
      sort_order = 'ASC',
      sort_field = 'id',
    } = query;

    const totalItems = (await DepositMoney.findAll()).length;
    const totalPages = Math.ceil(totalItems / limit);

    const depositMoney = await DepositMoney.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
    });

    const currentPage = Number(page);

    return {
      data: depositMoney,
      totalItems,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const depositMoney = await DepositMoney.findByPk(id, {});

    if (!depositMoney) throw Error('DEPOSIT_NOT_FOUND');

    return { data: depositMoney };
  },
};
