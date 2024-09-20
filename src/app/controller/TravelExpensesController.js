import HttpStatus from 'http-status';
import TravelExpensesService from '../service/TravelExpensesService';

class TravelExpensesController {
  async create(req, res, next) {
    try {
      const data = await TravelExpensesService.create(req.driverId, req.body);
      return res
        .status(HttpStatus.CREATED)
        .json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(error.status).json({ mgs: error.message }));
    }
  }

  async uploadDocuments(req, res, next) {
    try {
      const data = await TravelExpensesService.uploadDocuments(req, req.params);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async deleteFile(req, res, next) {
    try {
      const data = await TravelExpensesService.deleteFile(req.params);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await TravelExpensesService.getAll(req.query);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getId(req, res, next) {
    try {
      const data = await TravelExpensesService.getId(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new TravelExpensesController();
