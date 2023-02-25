import httpStatus from 'http-status-codes';

import Freight from '../models/Freight';
import Notification from '../models/Notification';
import FinancialStatements from '../models/FinancialStatements';
import Restock from '../models/Restock';
import TravelExpenses from '../models/TravelExpenses';
import DepositMoney from '../models/DepositMoney';

export default {
  async createFreight(user, body) {
    let result = {};

    const financial = await FinancialStatements.findOne({
      where: { driver_id: user.driverId, status: true },
    });

    if (!financial) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Financial not found',
      };
      return result;
    }

    if (financial.status === false) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'This form has already been finished',
      };
      return result;
    }

    const freight = await Freight.create({
      ...body,
      financial_statements_id: financial.id,
    });

    await Notification.create({
      content: `${financial.driver_name}, Requisitou um novo check frete!`,
      user_id: financial.creator_user_id,
      freight_id: freight.id,
      driver_id: user.driverId,
    });

    result = {
      httpStatus: httpStatus.CREATED,
      status: 'Check order successful!',
    };
    return result;
  },

  async getIdFreight(id) {
    let result = {};

    const freight = await Freight.findByPk(id, {
      include: [
        {
          // bastecidas
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
          // despesas da viagem
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
          // deposito feito na viagem
          model: DepositMoney,
          as: 'deposit_money',
          attributes: ['id', 'type_transaction', 'local', 'type_bank', 'value'],
        },
      ],
    });

    if (!freight) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        msg: 'Freight not found',
      };
      return result;
    }
    // ton value and predicted fuel value
    const value_tonne = freight.value_tonne / 100;
    const preview_valueDiesel = freight.preview_value_diesel / 100;
    const preview_tonne = freight.preview_tonne * 100;
    // predicted gross value
    const preview_valueGross = preview_tonne * value_tonne;
    // fuel consumption forecast
    const amountSpentOnFuel =
      preview_valueDiesel / freight.preview_average_fuel;
    const resultValue =
      Math.round(freight.travel_km / 1000) * Math.round(amountSpentOnFuel);

    const discounted_fuel = preview_valueGross - Math.round(resultValue) * 100;

    // total value supplied
    const quantityRestock = freight.restock.map(function (res) {
      return parseInt(res.dataValues.total_value_fuel);
    });
    const totalQuantityRestock = quantityRestock.reduce(function (
      previousValue,
      currentValue
    ) {
      return Number(previousValue) + Number(currentValue);
    },
    0 && quantityRestock);
    // total amount expenses
    const quantityExpenses = freight.travel_expense.map(function (res) {
      return parseInt(res.dataValues.value);
    });
    const totalQuantityExpenses = quantityExpenses.reduce(function (
      previousValue,
      currentValue
    ) {
      return Number(previousValue) + Number(currentValue);
    },
    0 && quantityRestock);
    // total amount deposit money
    const quantityDepositMoney = freight.deposit_money.map(function (res) {
      return parseInt(res.dataValues.value);
    });
    const totalQuantityDepositMoney = quantityDepositMoney.reduce(function (
      previousValue,
      currentValue
    ) {
      return Number(previousValue) + Number(currentValue);
    },
    0 && quantityRestock);

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: {
        first_check: {
          start_city: freight.start_city,
          final_city: freight.final_city,
          location_truck: freight.location_of_the_truck,
          start_current_km: freight.start_km,
          travel_km: freight.travel_km,
          preview_average_fuel: freight.average_fuel,
          preview_tonne: freight.preview_tonne,
          preview_value_diesel: freight.preview_value_diesel,
          value_tonne: freight.value_tonne,
          status: freight.status,
          item_total: {
            preview_valueGross: preview_valueGross,
            preview_fuel_expense: Math.round(resultValue) * 100,
            fuel_discount_on_shipping: discounted_fuel,
          },
        },
        // check apoapproved
        second_check: {
          final_km: freight.final_km,
          final_total_tonne: freight.final_total_tonne,
          toll_value: freight.toll_value,
          discharge: freight.discharge,
          img_proof_cte: freight.img_proof_cte,
          img_proof_ticket: freight.img_proof_ticket,
          img_proof_freight_letter: freight.img_proof_freight_letter,
          item_total: {
            total_value_fuel: totalQuantityRestock,
            total_value_expenses: totalQuantityExpenses,
            total_deposit_money: totalQuantityDepositMoney,
          },
        },
        restock: freight.restock,
        travel_expense: freight.travel_expense,
        deposit_money: freight.deposit_money,
      },
    };

    if (freight.final_km === null)
      delete result.dataResult.second_check.final_km;
    if (freight.final_total_tonne === null)
      delete result.dataResult.second_check.final_total_tonne;
    if (freight.toll_value === null)
      delete result.dataResult.second_check.toll_value;
    if (freight.discharge === null)
      delete result.dataResult.second_check.discharge;
    if (freight.img_proof_cte === null)
      delete result.dataResult.second_check.img_proof_cte;
    if (freight.img_proof_ticket === null)
      delete result.dataResult.second_check.img_proof_ticket;
    if (freight.img_proof_freight_letter === null)
      delete result.dataResult.second_check.img_proof_freight_letter;

    return result;
  },

  async updateFreight(req, res) {
    let result = {};

    let freightReq = req;

    const freight = await Freight.findByPk(res.id);

    if (!freight) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        dataResult: { msg: 'Freight not found' },
      };
      return result;
    }

    if (freight.dataValues.status === 'approved') {
      const financial = await FinancialStatements.findByPk(
        freight.financial_statements_id
      );

      if (freight.final_total_tonne === null) {
        await Notification.create({
          content: `${financial.driver_name}, Inicio a viagem!`,
          user_id: financial.creator_user_id,
        });
      }

      await freight.update(freightReq);

      const freightResult = await Freight.findByPk(res.id);

      result = {
        httpStatus: httpStatus.OK,
        status: 'successful',
        dataResult: freightResult,
      };
      return result;
    } else {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        dataResult: { msg: 'Shipping was not approved' },
      };
      return result;
    }
  },

  async deleteFreight(req, res) {
    let result = {};

    const id = req.id;

    const freight = await Freight.destroy({
      where: {
        id: id,
      },
    });

    if (!freight) {
      result = {
        httpStatus: httpStatus.BAD_REQUEST,
        dataResult: { msg: 'Freight not found' },
      };
      return result;
    }

    result = {
      httpStatus: httpStatus.OK,
      status: 'successful',
      dataResult: { msg: 'Deleted freight' },
    };
    return result;
  },
};
