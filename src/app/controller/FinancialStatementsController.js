import FinancialStatementsService from '../service/FinancialStatementsService';

class FinancialStatementsController {
  async getAllFinancialStatementsFinished(req, res) {
    try {
      let response =
        await FinancialStatementsService.getAllFinancialStatementsFinished(
          req,
          res
        );

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg });
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }

  async getIdFinancialStatements(req, res) {
    try {
      let response = await FinancialStatementsService.getIdFinancialStatements(
        req
      );

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json(response);
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }

  async updateFinancialStatements(req, res) {
    try {
      let response = await FinancialStatementsService.updateFinancialStatements(
        req.body,
        req.params
      );

      if (response.httpStatus === 200) {
        return res.send(response);
      } else {
        return res.status(response.httpStatus).json({ msg: response.msg });
      }
    } catch (error) {
      return res.status(400).json({ mgs: error.message });
    }
  }
}

export default new FinancialStatementsController();
