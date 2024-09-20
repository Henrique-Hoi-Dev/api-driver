import Restock from '../models/Restock';
import Freight from '../models/Freight';
import FinancialStatements from '../models/FinancialStatements';
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
  async create(driverId, body) {
    let { freight_id, value_fuel, liters_fuel } = body;

    const financial = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financial) throw new CustomError('FINANCIAL_NOT_FOUND', 404);

    const freight = await Freight.findByPk(freight_id);
    if (!freight) throw new CustomError('FREIGHT_NOT_FOUND', 404);

    if (freight.status === 'STARTING_TRIP') {
      const total_value_fuel = value_fuel * liters_fuel;

      const now = updateHours(dayjs().tz('America/Sao_Paulo').utcOffset() / 60);

      const result = await Restock.create({
        ...body,
        total_value_fuel,
        registration_date: now,
        financial_statements_id: financial.id,
      });

      return { data: result };
    }

    throw new CustomError('This front is not traveling', 404);
  },

  async uploadDocuments(payload, { id }) {
    const { file, body } = payload;

    const restock = await Restock.findByPk(id);
    if (!restock) throw Error('RESTOCK_NOT_FOUND');

    if (restock.img_receipt && restock.img_receipt.uuid) {
      await this.deleteFile({ id });
    }

    if (!body.category) throw Error('CATEGORY_OR_TYPE_NOT_FOUND');

    const originalFilename = file.originalname;

    const code = generateRandomCode(9);

    file.name = code;

    await sendFile(payload);

    const infoRestock = await restock.update({
      img_receipt: {
        uuid: file.name,
        name: originalFilename,
        mimetype: file.mimetype,
        category: body.category,
      },
    });

    return infoRestock;
  },

  async deleteFile({ id }) {
    const restock = await Restock.findByPk(id);
    if (!restock) throw Error('FREIGHT_NOT_FOUND');

    try {
      await this._deleteFileIntegration({
        filename: restock.img_receipt.uuid,
        category: restock.img_receipt.category,
      });

      const infoRestock = await restock.update({
        img_receipt: {},
      });

      return infoRestock;
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

    const totalItems = (await Restock.findAll()).length;
    const totalPages = Math.ceil(totalItems / limit);

    const restocks = await Restock.findAll({
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
    });

    const currentPage = Number(page);

    return {
      data: restocks,
      totalItems,
      totalPages,
      currentPage,
    };
  },

  async getId(id) {
    const restock = await Restock.findByPk(id);
    if (!restock) throw Error('RESTOCK_NOT_FOUND');

    return {
      data: restock,
    };
  },
};
