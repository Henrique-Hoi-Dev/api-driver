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

    if (!financial) {
      throw Error('FINANCIAL_NOT_FOUND');
    }

    const result = await Freight.create({
      ...body,
      status: 'DRAFT',
      financial_statements_id: financial.id,
    });

    return {
      data: result,
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
            'value_fuel',
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
            'registration_date',
            'payment',
          ],
        },
      ],
    });

    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    return { data: freight };
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

  async update(body, id) {
    const freight = await Freight.findByPk(id);
    if (!freight) throw Error('FREIGHT_NOT_FOUND');

    await freight.update(body);

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

      return { data: result };
    }

    return { data: await Freight.findByPk(id) };
  },

  async startingTrip({ freight_id, truck_current_km }, { name, id }) {
    const financial = await FinancialStatements.findOne({
      where: { driver_id: id, status: true },
      include: {
        model: Freight,
        as: 'freight',
      },
    });

    const freighStartTrip = financial.freight.find(
      (item) => item.status === 'STARTING_TRIP'
    );
    if (freighStartTrip) throw Error('THERE_IS_ALREADY_A_TRIP_IN_PROGRESS');

    const freight = await Freight.findByPk(freight_id);

    if (freight.status === 'APPROVED') {
      await freight.update({
        status: 'STARTING_TRIP',
        truck_current_km: truck_current_km,
      });

      if (lastFreight) {
        await financial.update({
          start_km: truck_current_km,
        });
      }

      await Notification.create({
        content: `${name}, Inicio a viagem!`,
        user_id: financialStatement.creator_user_id,
        financial_statements_id: freight.financial_statements_id,
      });
    }
    return { data: { msg: 'Starting Trip' } };
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
