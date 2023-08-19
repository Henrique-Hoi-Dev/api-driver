import Driver from '../models/Driver';
import Freight from '../models/Freight';
import FinancialStatements from '../models/FinancialStatements';
import Restock from '../models/Restock';

export default {
  async getAllFinished(id, query) {
    const {
      page = 1,
      limit = 100,
      sort_order = 'ASC',
      sort_field = 'id',
    } = query;

    const total = (
      await FinancialStatements.findAll({
        where: { driver_id: id, status: false },
      })
    ).length;

    const totalPages = Math.ceil(total / limit);

    const financialStatements = await FinancialStatements.findAll({
      where: { driver_id: id, status: false },
      order: [[sort_field, sort_order]],
      limit: limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      include: {
        model: Freight,
        as: 'freigth',
      },
    });

    const currentPage = Number(page);

    return {
      dataResult: financialStatements,
      total,
      totalPages,
      currentPage,
    };
  },

  async getInProgress(id) {
    const financialStatement = await FinancialStatements.findOne({
      where: { driver_id: id, status: true },
      include: {
        model: Freight,
        as: 'freigth',
      },
    });

    if (!financialStatement) throw Error('FINANCIAL_NOT_FOUND');
    return { dataResult: financialStatement };
  },

  async update(body, driverId) {
    const financialStatement = await FinancialStatements.findOne({
      where: { driver_id: driverId, status: true },
    });
    if (!financialStatement) throw Error('FINANCIAL_NOT_FOUND');

    const { id, truck_models, total_value, cart_models, driver_id } =
      await financialStatement.update(body);

    const driverFinancial = await Driver.findByPk(driver_id);
    if (!driverFinancial) throw Error('DRIVER_NOT_FOUND');

    await driverFinancial.update({
      credit: total_value,
      truck: truck_models,
      cart: cart_models,
    });

    const driver = await Driver.findByPk(driver_id, {
      attributes: ['credit', 'truck', 'cart'],
    });

    const financial = await FinancialStatements.findByPk(id);

    return { dataResult: driver, financial: financial };
  },

  _calculate(values) {
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
};
