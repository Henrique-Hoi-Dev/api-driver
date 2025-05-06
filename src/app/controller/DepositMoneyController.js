import HttpStatus from 'http-status';
import DepositMoneyService from '../service/DepositMoneyService';

class DepositMoneyController {
  async create(req, res, next) {
    try {
      const data = await DepositMoneyService.create(req.user, req.body);
      return res
        .status(HttpStatus.CREATED)
        .json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(error.status).json({ mgs: error.message }));
    }
  }

  async uploadDocuments(req, res, next) {
    try {
      const data = await DepositMoneyService.uploadDocuments(req, req.params);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async deleteFile(req, res, next) {
    try {
      const data = await DepositMoneyService.deleteFile(req.params);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await DepositMoneyService.getAll(req.query);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getId(req, res, next) {
    try {
      const data = await DepositMoneyService.getId(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new DepositMoneyController();
