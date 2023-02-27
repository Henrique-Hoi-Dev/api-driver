import DepositMoneyService from '../service/DepositMoneyService';

class DepositMoneyController {
  async createDepositMoney(req, res) {
    try {
      let response = await DepositMoneyService.createDepositMoney(
        req,
        req.body
      );

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(response.httpStatus).json({ error: error.message });
    }
  }

  async getAllDepositMoney(req, res) {
    try {
      let response = await DepositMoneyService.getAllDepositMoney(req.query);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(response.httpStatus).json({ mgs: error.message });
    }
  }

  async getIdDepositMoney(req, res) {
    try {
      let response = await DepositMoneyService.getIdDepositMoney(req.params.id);

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(response.httpStatus).json({ mgs: error.message });
    }
  }
}

export default new DepositMoneyController();
