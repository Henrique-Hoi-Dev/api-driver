import Freight from '../models/Freight';
import Notification from '../models/Notification';
import FinancialStatements from '../models/FinancialStatements';
import Restock from '../models/Restock';
import TravelExpenses from '../models/TravelExpenses';
import DepositMoney from '../models/DepositMoney';

export default {
  async create(driverId, body) {
    const financial = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financial) throw Error('FINANCIAL_NOT_FOUND');
    if (financial.status === false)
      throw Error('This form has already been finished');

    const freight = await Freight.findAll({
      where: { financial_statements_id: financial.id },
    });

    if (freight.length > 0) {
      const first = freight.map((res) => res.dataValues);
      await financial.update({
        start_km: first[0].truck_current_km,
      });
    }

    const result = await Freight.create({
      ...body,
      financial_statements_id: financial.id,
    });

    await Notification.create({
      content: `${financial.driver_name}, Requisitou um novo check frete!`,
      user_id: financial.creator_user_id,
      freight_id: result.id,
      driver_id: driverId,
      financial_statements_id: financial.id,
    });

    return {
      dataResult: result,
    };
  },

  async getId(id) {
    const freight = await Freight.findByPk(id, {
      include: [
        {
          model: Restock,
          as: 'restock',
          attributes: [
            'id',
            'name_establishment',
            'city',
            'date',
            'value_fuel',
            'total_nota_value',
            'liters_fuel',
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
          ],
        },
        {
          model: DepositMoney,
          as: 'deposit_money',
          attributes: ['id', 'type_transaction', 'local', 'type_bank', 'value'],
        },
      ],
    });

    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    return freight;
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

    console.log(
      '🚀 ~ file: FreightService.js:116 ~ _updateValorFinancial ~ totalvalueDeposit:',
      totalvalueRestock,
      totalvalueTravel
    );

    await financial.update({
      total_value:
        (await this._calculate([totalvalueTravel, totalvalueRestock])) -
        totalvalueDeposit,
    });
  },

  async update(body, id) {
    const freight = await Freight.findByPk(id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    if (freight.status === 'APPROVED') {
      const financial = await FinancialStatements.findByPk(
        freight.financial_statements_id
      );

      await freight.update(body);

      await Notification.create({
        content: `${financial.driver_name}, Inicio a viagem!`,
        user_id: financial.creator_user_id,
        financial_statements_id: financial.id,
      });

      return { dataResult: await Freight.findByPk(id) };
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

      return { dataResult: result };
    }
  },

  async delete(id) {
    const freight = await Freight.destroy({
      where: {
        id: id,
      },
    });
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    return { msg: 'Deleted freight' };
  },
};
