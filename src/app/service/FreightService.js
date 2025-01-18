import Freight from '../models/Freight';
import Notification from '../models/Notification';
import FinancialStatements from '../models/FinancialStatements';
import Restock from '../models/Restock';
import TravelExpenses from '../models/TravelExpenses';
import DepositMoney from '../models/DepositMoney';
import FinancialService from '../service/FinancialStatementsService';
// import { v6 as uuidV6 } from 'uuid';
import ApiGoogle from '../providers/router_map_google';

import { deleteFile, getFile, sendFile } from '../providers/aws';
import { generateRandomCode } from '../utils/crypto';

export default {
  async create(driverId, body) {
    const financial = await FinancialService.getFinancialCurrent(driverId);

    if (!financial) {
      throw Error('FINANCIAL_IN_PROGRESS');
    }

    const result = await Freight.create({
      ...body,
      status: 'DRAFT',
      financial_statements_id: financial.id,
    });

    return result;
  },

  async _googleQuery(startCity, finalCity) {
    const kmTravel = await ApiGoogle.getRoute(startCity, finalCity, 'driving');

    return kmTravel;
  },

  async getId(id) {
    let freight = await Freight.findByPk(id, {
      include: [
        {
          model: Restock,
          as: 'restock',
          attributes: [
            'id',
            'name_establishment',
            'city',
            'value_fuel',
            'img_receipt',
            'total_nota_value',
            'liters_fuel',
            'registration_date',
            'payment',
          ],
        },
        {
          model: TravelExpenses,
          as: 'travel_expense',
          attributes: [
            'id',
            'name_establishment',
            'type_establishment',
            'expense_description',
            'value',
            'img_receipt',
            'registration_date',
            'payment',
          ],
        },
        {
          model: DepositMoney,
          as: 'deposit_money',
          attributes: [
            'id',
            'type_transaction',
            'local',
            'type_bank',
            'value',
            'img_receipt',
            'registration_date',
            'payment',
          ],
        },
      ],
    });

    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    const googleTravel = await this._googleQuery(
      freight.start_freight_city,
      freight.final_freight_city
    );

    const durationSeconds = googleTravel.duration.value;

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);

    return {
      ...freight.toJSON(),
      distance: googleTravel.distance.text,
      duration: `${hours} horas e ${minutes} minutos`,
    };
  },

  async _calculate(values) {
    let initialValue = 0;
    let total = values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );
    return total;
  },

  async _updateValorFinancial(props) {
    const financial = await FinancialStatements.findOne({
      where: { id: props.financial_statements_id, status: true },
    });

    const restock = await Restock.findAll({ where: { freight_id: props.id } });
    const valoresRestock = restock.map((res) => res.total_nota_value);
    const totalvalueRestock = await this._calculate(valoresRestock);

    const travel = await TravelExpenses.findAll({
      where: { freight_id: props.id },
    });
    const valoresTravel = travel.map((res) => res.value);
    const totalvalueTravel = await this._calculate(valoresTravel);

    const deposit = await DepositMoney.findAll({
      where: { freight_id: props.id },
    });
    const valoresDeposit = deposit.map((res) => res.value);
    const totalvalueDeposit = await this._calculate(valoresDeposit);

    console.log('totalvalueDeposit:', totalvalueRestock, totalvalueTravel);

    await financial.update({
      total_value:
        (await this._calculate([totalvalueTravel, totalvalueRestock])) -
        totalvalueDeposit,
    });
  },

  async update(body, id, user) {
    const freight = await Freight.findByPk(id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    await freight.update(body);

    if (body.status === 'PENDING') {
      const financial = await FinancialService.getFinancialCurrent(user.id);

      await Notification.create({
        content: `${user.name}, Requisitou um novo check frete!`,
        user_id: financial.creator_user_id,
        freight_id: id,
        driver_id: user.id,
        financial_statements_id: financial.id,
      });
    }

    if (freight.status === 'STARTING_TRIP') {
      const result = await freight.update({
        tons_loaded: body.tons_loaded,
        toll_value: body.toll_value,
        truck_km_completed_trip: body.truck_km_completed_trip,
        discharge: body.discharge,
        img_proof_cte: body.img_proof_cte,
        img_proof_ticket: body.img_proof_ticket,
        img_proof_freight_letter: body.img_proof_freight_letter,
      });

      await this._updateValorFinancial(result);

      return result;
    }

    return await Freight.findByPk(id);
  },

  async uploadDocuments(payload, { id }) {
    const { file, body } = payload;
    if (!file) throw Error('FILE_NOT_FOUND');

    const freight = await Freight.findByPk(id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    if (!body.category || !body.typeImg)
      throw Error('IMAGE_CATEGORY_OR_TYPE_NOT_FOUND');

    const originalFilename = file.originalname;

    const code = generateRandomCode(9);

    file.name = code;

    await sendFile(payload);

    let infoFreight;

    if (body.typeImg === 'freight_letter') {
      if (
        freight.img_proof_freight_letter &&
        freight.img_proof_freight_letter.uuid
      ) {
        await this.deleteFile({ id }, { typeImg: 'freight_letter' });
      }

      infoFreight = await freight.update({
        img_proof_freight_letter: {
          uuid: file.name,
          name: originalFilename,
          mimetype: file.mimetype,
          category: body.category,
        },
      });
    }

    if (body.typeImg === 'ticket') {
      if (freight.img_proof_ticket && freight.img_proof_ticket.uuid) {
        await this.deleteFile({ id }, { typeImg: 'ticket' });
      }

      infoFreight = await freight.update({
        img_proof_ticket: {
          uuid: file.name,
          name: originalFilename,
          mimetype: file.mimetype,
          category: body.category,
        },
      });
    }

    if (body.typeImg === 'cte') {
      if (freight.img_proof_cte && freight.img_proof_cte.uuid) {
        await this.deleteFile({ id }, { typeImg: 'cte' });
      }

      infoFreight = await freight.update({
        img_proof_cte: {
          uuid: file.name,
          name: originalFilename,
          mimetype: file.mimetype,
          category: body.category,
        },
      });
    }

    return infoFreight;
  },

  async getDocuments({ filename, category }) {
    try {
      const { Body, ContentType } = await getFile({ filename, category });
      const fileData = Buffer.from(Body);
      return { contentType: ContentType, fileData };
    } catch (error) {
      throw error;
    }
  },

  async deleteFile({ id }, { typeImg }) {
    const freight = await Freight.findByPk(id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    if (!typeImg) throw Error('IMAGE_TYPE_NOT_FOUND');

    let infoFreight;

    try {
      if (typeImg === 'freight_letter') {
        await this._deleteFileIntegration({
          filename: freight.img_proof_freight_letter.uuid,
          category: freight.img_proof_freight_letter.category,
        });

        infoFreight = await freight.update({
          img_proof_freight_letter: {},
        });
      }

      if (typeImg === 'ticket') {
        await this._deleteFileIntegration({
          filename: freight.img_proof_ticket.uuid,
          category: freight.img_proof_ticket.category,
        });

        infoFreight = await freight.update({
          img_proof_ticket: {},
        });
      }

      if (typeImg === 'cte') {
        await this._deleteFileIntegration({
          filename: freight.img_proof_cte.uuid,
          category: freight.img_proof_cte.category,
        });

        infoFreight = await freight.update({
          img_proof_cte: {},
        });
      }

      return infoFreight;
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

  async startingTrip({ freight_id, truck_current_km }, { name, id }) {
    const financial = await FinancialService.getFinancialCurrent(id);

    const freighStartTrip = financial.freight.find(
      (item) => item.status === 'STARTING_TRIP'
    );
    if (freighStartTrip) throw Error('THERE_IS_ALREADY_A_TRIP_IN_PROGRESS');

    const freight = await Freight.findByPk(freight_id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    if (freight.status === 'APPROVED') {
      await freight.update({
        status: 'STARTING_TRIP',
        truck_current_km: truck_current_km,
      });

      await financial.update({
        start_km: truck_current_km,
      });

      await Notification.create({
        content: `${name}, Inicio a viagem!`,
        user_id: financial.creator_user_id,
        financial_statements_id: freight.financial_statements_id,
      });

      return { data: { msg: 'Starting Trip' } };
    } else {
      throw Error('SHIPPING_WAS_NOT_APPROVED');
    }
  },

  async finishedTrip({ freight_id, truck_km_completed_trip }, { name, id }) {
    const financial = await FinancialService.getFinancialCurrent(id);

    const freight = await Freight.findByPk(freight_id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    if (freight.status !== 'STARTING_TRIP')
      throw Error('THIS_TRIP_IS_NOT_IN_PROGRESS_TO_FINALIZE');

    if (freight.status === 'STARTING_TRIP') {
      await freight.update({
        status: 'FINISHED',
        truck_km_completed_trip: truck_km_completed_trip,
      });

      await financial.update({
        final_km: truck_km_completed_trip,
      });

      await Notification.create({
        content: `${name}, Finalizou a viagem!`,
        user_id: financial.creator_user_id,
        financial_statements_id: freight.financial_statements_id,
      });
    }
    return { data: { msg: 'Finished Trip' } };
  },

  async delete(id) {
    const freight = await Freight.destroy({
      where: {
        id: id,
      },
    });
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    return { data: { msg: 'Deleted freight' } };
  },
};
