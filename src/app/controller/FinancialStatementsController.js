import HttpStatus from 'http-status';
import FinancialStatementsService from '../service/FinancialStatementsService';

class FinancialStatementsController {
  async getAllFinished(req, res, next) {
    try {
      const data = await FinancialStatementsService.getAllFinished(
        req.driverId,
        req.query
      );
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getInProgress(req, res, next) {
    try {
      const data = await FinancialStatementsService.getInProgress(req.driverId);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async update(req, res, next) {
    try {
      const data = await FinancialStatementsService.update(
        req.body,
        req.driverId
      );
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new FinancialStatementsController();
